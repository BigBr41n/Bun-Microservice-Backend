import express from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.connect';

dotenv.config();

//express instance
const app = express();

//port
const PORT = process.env.PORT || 3002;

//middlewares
app.use(express.json({ limit: "1mb" }));


(async () => {
    try {
      await connectDB(); 
  
      const server = app.listen(PORT, () => {
        console.log(`Auth Server is running on http://localhost:${PORT}`);
      });

      server.keepAliveTimeout = 3000; 
  
      process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
          console.log('HTTP server closed');
          process.exit(0);
        });
      });
  
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
})()
  



