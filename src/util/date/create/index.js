import { parse, fromUnixTime, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export class DateUtilCreate {
  /**
   * Create a date with value, format, and optional timezone
   */
  static create({ value, format: dateFormat, timezone = "UTC" }) {
    if (!value) return null;

    // If format is provided, parse the date
    if (dateFormat) {
      const parsedDate = parse(value, dateFormat, new Date());
      return isValid(parsedDate) ? toZonedTime(parsedDate, timezone) : null;
    }

    // If value is ISO string or Date object
    return isValid(new Date(value))
      ? toZonedTime(new Date(value), timezone)
      : null;
  }

  /**
   * Return current timestamp with timezone
   */
  static now(timezone = "UTC") {
    const currentDate = new Date();
    return toZonedTime(currentDate, timezone);
  }

  /**
   * Create from Unix timestamp (in seconds or milliseconds)
   */
  static fromUnix(unixTimestamp, timezone = "UTC") {
    const ts =
      unixTimestamp.toString().length === 10
        ? unixTimestamp * 1000
        : unixTimestamp;
    return toZonedTime(fromUnixTime(ts / 1000), timezone);
  }

  /**
   * Create from ISO string
   */
  static fromISOString(isoString, timezone = "UTC") {
    const date = new Date(isoString);
    return toZonedTime(date, timezone);
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
  }) {
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
