import { format } from "date-fns";

export class DateUtilFormat {
  // Format date using a custom string
  static formatDate(date, formatStr) {
    return format(date, formatStr);
  }

  // Get ISO format of the date
  static toISOString(date) {
    return date.toISOString();
  }

  // Get Unix timestamp of the date
  static toUnix(date) {
    return Math.floor(date.getTime() / 1000);
  }

  // Convert date to JSON string format
  static toJSON(date) {
    return date.toJSON();
  }

  // Localized string with options
  static toLocaleString(date, locale = "en-US", opts = {}) {
    return date.toLocaleString(locale, opts);
  }

  // Get timezone offset (+05:30, Z)
  static getOffset(date) {
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.abs(Math.floor(offset / 60))).padStart(2, "0");
    const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
}
