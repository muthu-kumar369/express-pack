import { i18n } from "../i18n/index.js";

export class ResponseUtil {
  // utils/response.js
  static send(req, res, code, data = {}) {
    if (res.headersSent) return;

    if (!code)
      throw new Error('ResponseUtil.send: "code" parameter is required.');

    const config = i18n.getConfig(code);
    const message = i18n.getMessage(res.locale || "en", code);

    const body = {
      success: config?.success,
      code: config?.code,
      ...data,
      ...(message && { message }),
      ...(req.requestId && { requestId: req.requestId }),
    };

    return res.status(config?.http_code).json(body);
  }
}
