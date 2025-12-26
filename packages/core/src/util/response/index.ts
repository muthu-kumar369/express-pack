import { i18n } from "../i18n/index.js";
import type { ResponseUtilSend } from "../types";

/**
 * ResponseUtil provides a standardized way to send API responses with i18n support.
 * 
 * Automatically formats responses with consistent structure including success status,
 * status codes, messages, data, and request IDs. Supports internationalization
 * through message codes.
 * 
 * @example
 * ```typescript
 * import { ResponseUtil } from 'express-pack';
 * 
 * // Success response
 * router.get('/users/:id', async (req, res) => {
 *   const user = await User.findById(req.params.id);
 *   ResponseUtil.send(req, res, 'SUCCESS', { user });
 * });
 * 
 * // Error response
 * router.post('/users', async (req, res) => {
 *   try {
 *     const user = await User.create(req.body);
 *     ResponseUtil.send(req, res, 'CREATED', { user });
 *   } catch (error) {
 *     ResponseUtil.send(req, res, 'VALIDATION_ERROR');
 *   }
 * });
 * ```
 * 
 * @category Utilities
 */
export class ResponseUtil {
  /**
   * Sends a standardized API response with i18n support.
   * 
   * Formats the response with:
   * - `success`: Boolean indicating success/failure
   * - `code`: Application-specific status code
   * - `message`: Localized message based on code and locale
   * - `data`: Optional response data
   * - `requestId`: Request tracking ID (if available)
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @param code - Message code for i18n lookup (e.g., 'SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR')
   * @param data - Optional data to include in response
   * 
   * @throws {Error} If code parameter is not provided
   * 
   * @example
   * ```typescript
   * import { ResponseUtil } from 'express-pack';
   * 
   * // Success with data
   * ResponseUtil.send(req, res, 'SUCCESS', {
   *   user: { id: 1, name: 'John' }
   * });
   * // Response: { success: true, code: 200, message: "Success", data: {...}, requestId: "..." }
   * 
   * // Success without data
   * ResponseUtil.send(req, res, 'NO_CONTENT');
   * // Response: { success: true, code: 204, message: "No content", requestId: "..." }
   * 
   * // Error response
   * ResponseUtil.send(req, res, 'NOT_FOUND');
   * // Response: { success: false, code: 404, message: "Not found", requestId: "..." }
   * 
   * // Validation error with details
   * ResponseUtil.send(req, res, 'VALIDATION_ERROR', {
   *   errors: [
   *     { field: 'email', message: 'Invalid email format' },
   *     { field: 'password', message: 'Password too short' }
   *   ]
   * });
   * 
   * // Custom business logic errors
   * ResponseUtil.send(req, res, 'INSUFFICIENT_BALANCE', {
   *   balance: 50,
   *   required: 100
   * });
   * 
   * // Localized responses (based on req.locale)
   * // If req.locale = 'es', message will be in Spanish
   * ResponseUtil.send(req, res, 'SUCCESS', { user });
   * 
   * // Common usage patterns
   * 
   * // Create resource
   * router.post('/posts', async (req, res) => {
   *   const post = await Post.create(req.body);
   *   ResponseUtil.send(req, res, 'CREATED', { post });
   * });
   * 
   * // Update resource
   * router.put('/posts/:id', async (req, res) => {
   *   const post = await Post.findByIdAndUpdate(req.params.id, req.body);
   *   if (!post) {
   *     return ResponseUtil.send(req, res, 'NOT_FOUND');
   *   }
   *   ResponseUtil.send(req, res, 'SUCCESS', { post });
   * });
   * 
   * // Delete resource
   * router.delete('/posts/:id', async (req, res) => {
   *   await Post.findByIdAndDelete(req.params.id);
   *   ResponseUtil.send(req, res, 'NO_CONTENT');
   * });
   * 
   * // List with pagination
   * router.get('/posts', async (req, res) => {
   *   const { page = 1, limit = 10 } = req.query;
   *   const posts = await Post.paginate({ page, limit });
   *   ResponseUtil.send(req, res, 'SUCCESS', {
   *     posts: posts.docs,
   *     pagination: {
   *       page: posts.page,
   *       totalPages: posts.totalPages,
   *       total: posts.totalDocs
   *     }
   *   });
   * });
   * 
   * // Error handling
   * router.get('/protected', async (req, res) => {
   *   if (!req.user) {
   *     return ResponseUtil.send(req, res, 'UNAUTHORIZED');
   *   }
   *   
   *   if (!req.user.hasPermission('read')) {
   *     return ResponseUtil.send(req, res, 'FORBIDDEN');
   *   }
   *   
   *   const data = await fetchProtectedData();
   *   ResponseUtil.send(req, res, 'SUCCESS', { data });
   * });
   * ```
   */
  static send: ResponseUtilSend = (req, res, code, data = {}) => {
    if (res.headersSent) return;

    if (!code)
      throw new Error('ResponseUtil.send: "code" parameter is required.');

    const config = i18n.getConfig(code);
    const message = i18n.getMessage(res.locale || "en", code);

    const body = {
      success: config?.success,
      code: config?.code,
      ...(Object?.keys(data)?.length ? { data } : {}),
      ...(message && { message }),
      ...(req.requestId && { requestId: req.requestId }),
    };

    return res.status(config?.http_code).json(body);
  };
}
