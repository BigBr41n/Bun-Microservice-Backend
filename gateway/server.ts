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
    allowedHeaders: ['Content-Type', 'Authorization'], //till now the only allowed headers
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
  target: `http://localhost:${process.env.AUTH_PORT}`,  // Auth Service 
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/auth': '/v1/',  // Rewrites /api/v1/users to /v1/
  },
}));



app.use('/api/v1/products', createProxyMiddleware({
  target: `http://localhost:${process.env.PRODUCT_PORT}`,  // Products Service
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/products': '/v1/',  // Rewrites /api/v1/products to /v1/
  },
}));




app.use('/api/v1/orders', createProxyMiddleware({
    target: `http://localhost:${process.env.ORDER_PORT}`,  // Orders Service
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/orders': '/v1/',  // Rewrites /api/v1/products to /v1/
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