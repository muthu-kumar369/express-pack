import { i18n } from "../i18n/index.js";
import type { ResponseUtilSend } from "../types";

export class ResponseUtil {
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
