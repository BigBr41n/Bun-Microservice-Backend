import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
    statusCode: 429,
    retryAfter: 15 * 60 * 1000, // 15 minutes
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 409,
      error: "Too many requests ",
      message:
        "you have exceeded the request limit for this endpoint , try again later",
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many Login Attempts , please try again later",
    statusCode: 429,
    retryAfter: 15 * 60 * 1000, // 15 minutes
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 409,
      error: "Too many requests ",
      message:
        "you have exceeded the request limit for this endpoint , try again later",
    });
  },
});