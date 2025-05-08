export class AsyncRouteWrapper {
  /**
   * Wraps any async/sync function and passes errors to Express
   * @param {Function} fn - controller or middleware function
   * @returns Express middleware
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
