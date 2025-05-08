import {
  isValid as isValidDate,
  parse,
  isLeapYear as checkLeapYear,
  isWeekend as checkWeekend,
  isSameDay as checkSameDay,
} from "date-fns";

export class DateUtilValidate {
  // Check if the date is a valid date string or object
  static isValid(date) {
    return isValidDate(date);
  }

  // Parse date string using an array of formats
  static parseDate(str, formats = []) {
    let parsedDate = null;
    for (const format of formats) {
      parsedDate = parse(str, format, new Date());
      if (isValidDate(parsedDate)) {
        break;
      }
    }
    return parsedDate;
  }

  // Check if the year is a leap year
  static isLeapYear(year) {
    return checkLeapYear(new Date(year, 0, 1)); // Check if Jan 1 of the given year is a leap year
  }

  // Check if daylight saving time (DST) is in effect
  static isDST(date) {
    const jan = new Date(date.getFullYear(), 0, 1); // January
    const jul = new Date(date.getFullYear(), 6, 1); // July
    return (
      date.getTimezoneOffset() <
      Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    );
  }

  // Check if the date is on the weekend (Saturday/Sunday)
  static isWeekend(date) {
    return checkWeekend(date);
  }

  // Check if the given date is the same calendar day as another
  static isSameDay(date1, date2) {
    return checkSameDay(date1, date2);
  }
}
