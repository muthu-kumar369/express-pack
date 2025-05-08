export class RequestTracer {
  static addRequestId(req, res, next) {
    const requestId =
      req.headers["x-request-id"] ||
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId; // Attach the request ID to the request object
    res.setHeader("X-Request-ID", requestId); // Return the ID in the response headers
    next();
  }
}
