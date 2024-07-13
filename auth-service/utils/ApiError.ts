export class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
    }
}


// Declare global augmentation
declare global {
  var ApiError: typeof import("./ApiError").ApiError;
}

// Attach it to the global object
globalThis.ApiError = require("./apiError").ApiError;