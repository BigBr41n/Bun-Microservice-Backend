import client from 'prom-client';
import express from 'express';
import logger from './logger'


const app = express();


const registry = new client.Registry();

// Create a counter for tracking the number of requests
export const requestCount = new client.Counter({
  name: 'http_request_count',
  help: 'Number of HTTP requests',
  labelNames: ['method', 'endpoint', 'status_code'],
});


// Create a timer for tracking the response time
export const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});


// Register the counters and timers with the registry 
registry.registerMetric(requestCount);
registry.registerMetric(requestDuration);



export const startMetricsServer = async ()=>{
    const collectDefaultMetrics = client.collectDefaultMetrics;
    
    collectDefaultMetrics();
    
    app.get("/metrics", async (req, res) => {
      res.set("Content-Type", registry.contentType);
      return res.send(await registry.metrics());
    });
    
    app.listen(9101, () => {
      logger.info("Metrics server started at http://localhost:9100");
    });
}