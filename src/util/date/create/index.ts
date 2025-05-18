import { CreateDateOptions, DateParts } from "@/util/types";
import { parse, fromUnixTime, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export class DateUtilCreate {
  /**
   * Create a date with value, format, and optional timezone
   */
  static create({
    value,
    format: dateFormat,
    timezone = "UTC",
  }: CreateDateOptions): Date | null {
    if (!value) return null;

    if (dateFormat) {
      const parsedDate = parse(value as string, dateFormat, new Date());
      return isValid(parsedDate) ? toZonedTime(parsedDate, timezone) : null;
    }

    const date = new Date(value);
    return isValid(date) ? toZonedTime(date, timezone) : null;
  }

  /**
   * Return current timestamp with timezone
   */
  static now(timezone: string = "UTC"): Date {
    return toZonedTime(new Date(), timezone);
  }

  /**
   * Create from Unix timestamp (in seconds or milliseconds)
   */
  static fromUnix(unixTimestamp: number, timezone: string = "UTC"): Date {
    const ts =
      unixTimestamp.toString().length === 10
        ? unixTimestamp * 1000
        : unixTimestamp;
    return toZonedTime(fromUnixTime(ts / 1000), timezone);
  }

  /**
   * Create from ISO string
   */
  static fromISOString(isoString: string, timezone: string = "UTC"): Date {
    return toZonedTime(new Date(isoString), timezone);
  }

  /**
   * Construct date from parts
   */
  static fromParts({
    year,
    month,
    day,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    timezone = "UTC",
  }: DateParts): Date {
    const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      millisecond
    );
    return toZonedTime(date, timezone);
  }
}
