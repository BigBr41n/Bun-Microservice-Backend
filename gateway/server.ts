import express, { type NextFunction, type Request , type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv'
import globalError from './utils/globalError';
import { logger } from './utils/logger';
import { globalLimiter, authLimiter } from './middlewares/rate-limiter';
import swaggerUi from 'swagger-ui-express';
import { combineSwaggerDocs } from './utils/combineSwaggerDocs';
dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 3000;


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); 

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(helmet.noSniff()); // Disable browser sniffing for XSS protection
app.use(helmet({
    contentSecurityPolicy: false, // Disable default CSP for flexibility
    hidePoweredBy: true,
}));




// Define log formats
const devFormat = ':method :url :status :response-time ms - :res[content-length]';
const prodFormat = 'combined';

if (process.env.NODE_ENV === 'development') {
    // Development: Use concise format and log directly to console or Winston
    app.use(morgan(devFormat, {
        stream: {
            write: (message: string) => logger.info(message.trim())
        }
    }));
} else {
    // Production: Use detailed format and log to Winston
    app.use(morgan(prodFormat, {
        stream: {
            write: (message: string) => logger.info(message.trim())
        }
    }));
}


//global rate limit
app.use(globalLimiter);


app.use('/api/v1/auth', authLimiter , createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_PORT}/v1`,  // Auth Service 
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/auth': '/',  // Rewrites /api/v1/users to /
  },
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  },
}));



app.use('/api/v1/products', createProxyMiddleware({
  target: `http://localhost:${process.env.PRODUCT_PORT}/v1`,  // Products Service
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/products': '/',  // Rewrites /api/v1/products to /
  },
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  },
}));




app.use('/api/v1/orders', createProxyMiddleware({
    target: `http://localhost:${process.env.ORDER_PORT}/v1`,  // Orders Service
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/orders': '/',  // Rewrites /api/v1/orders to /
    },
    on: {
      proxyReq: (proxyReq: any, req: any, res: any) => {
        if (req.body && Object.keys(req.body).length > 0) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    },
}));



// Serve Swagger UI with combined docs
app.use('/api-docs', async (req : Request, res :Response , next : NextFunction) => {
  try {
    const swaggerDocs = await combineSwaggerDocs();
    swaggerUi.setup(swaggerDocs)(req, res, next);
  } catch (error) {
    next(error);
  }
}, swaggerUi.serve);



//global error handler
app.use(globalError);


// Server settings
const server = app.listen(PORT, () => {
    logger.info(`Gateway Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  logger.warn('Received SIGTERM signal. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server has been closed.');
    process.exit(0);
  });
});


server.keepAliveTimeout = 65000; 
server.maxHeadersCount = 100;