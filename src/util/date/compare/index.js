import {
  isBefore as compareBefore,
  isAfter as compareAfter,
  isEqual as isSame,
  compareAsc,
  isWithinInterval,
} from "date-fns";

export class DateUtilCompare {
  // Check if the current date is before another date (optionally at unit level)
  static isBefore(date, otherDate, unit) {
    if (unit) {
      // Handle unit-level comparison for multiple units
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
        default:
          break;
      }

      return compareBefore(dateCopy, otherDateCopy);
    }

    return compareBefore(date, otherDate);
  }

  // Check if the current date is after another date (optionally at unit level)
  static isAfter(date, otherDate, unit) {
    if (unit) {
      // Handle unit-level comparison for multiple units
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
        default:
          break;
      }

      return compareAfter(dateCopy, otherDateCopy);
    }

    return compareAfter(date, otherDate);
  }

  // Check if the current date is the same as another date (optionally at unit level)
  static isSame(date, otherDate, unit) {
    if (unit) {
      // Handle unit-level comparison for multiple units
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
        default:
          break;
      }

      return isSame(dateCopy, otherDateCopy);
    }

    return isSame(date, otherDate);
  }

  // Compare two dates and return -1, 0, 1 based on comparison
  static compare(date, otherDate) {
    return compareAsc(date, otherDate);
  }

  // Check if the current date is within a range (inclusive)
  static isBetween(date, start, end) {
    return isWithinInterval(date, { start, end });
  }
}
