import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv'
import globalError from './utils/globalError';
dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 3000;


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(helmet.noSniff()); // Disable browser sniffing for XSS protection
app.use(helmet({
    contentSecurityPolicy: false, // Disable default CSP for flexibility
    hidePoweredBy: true,
}));



//morgan logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
}




app.use('/api/v1/auth', createProxyMiddleware({
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



//global error handler
app.use(globalError);


// Server settings
const server = app.listen(PORT, () => {
    console.log(`Gateway server is running on http://localhost:${PORT}`);
});


server.keepAliveTimeout = 65000; 
server.maxHeadersCount = 100;