import { format } from "date-fns";

export class DateUtilFormat {
  /**
   * Format date using a custom format string
   */
  static formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr);
  }

  /**
   * Return ISO string from Date object
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Return Unix timestamp from Date object
   */
  static toUnix(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Convert Date object to JSON string
   */
  static toJSON(date: Date): string {
    return date.toJSON();
  }

  /**
   * Convert Date object to locale string with options
   */
  static toLocaleString(
    date: Date,
    locale: string = "en-US",
    opts: Intl.DateTimeFormatOptions = {}
  ): string {
    return date.toLocaleString(locale, opts);
  }

  /**
   * Return timezone offset string like +05:30 or -04:00
   */
  static getOffset(date: Date): string {
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.abs(Math.floor(offset / 60))).padStart(2, "0");
    const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
}
