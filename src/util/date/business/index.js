import { addDays, getDay } from "date-fns";

export class DateUtilBusiness {
  /**
   * Check if the date is a business day (Monday to Friday)
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - Returns `true` if the date is a business day, otherwise `false`.
   *
   * Example:
   *   DateBusinessLogic.isBusinessDay(new Date()) // true (if it's a business day)
   */
  static isBusinessDay(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      const day = getDay(date); // Get the day of the week (0 for Sunday, 6 for Saturday)
      return day !== 0 && day !== 6; // Return true if it's not a Saturday or Sunday
    } catch (error) {
      console.error(`Error in isBusinessDay method: ${error.message}`);
      return false;
    }
  }

  /**
   * Get the next business day after the given date
   *
   * @param {Date} date - The starting date.
   * @returns {Date} - The next business day after the given date.
   *
   * Example:
   *   DateBusinessLogic.nextBusinessDay(new Date('2025-12-25')) // 2025-12-29 (Monday)
   */
  static nextBusinessDay(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      let nextDay = addDays(date, 1); // Add one day initially
      while (!this.isBusinessDay(nextDay)) {
        nextDay = addDays(nextDay, 1); // Keep adding days until we find a business day
      }
      return nextDay;
    } catch (error) {
      console.error(`Error in nextBusinessDay method: ${error.message}`);
      return null;
    }
  }

  /**
   * Get the nth weekday in a given month and year (e.g., 2nd Friday of March)
   *
   * @param {number} n - The nth occurrence of the weekday (e.g., 2 for the second occurrence).
   * @param {number} weekday - The weekday to search for (0 = Sunday, 6 = Saturday).
   * @param {number} month - The month (0 = January, 11 = December).
   * @param {number} year - The year.
   * @returns {Date} - The nth weekday in the given month and year.
   *
   * Example:
   *   DateBusinessLogic.getNthWeekdayInMonth(2, 5, 2, 2025) // Finds 2nd Friday in March 2025
   */
  static getNthWeekdayInMonth(n, weekday, month, year) {
    try {
      if (typeof n !== "number" || n <= 0) {
        throw new Error("n must be a positive integer.");
      }
      if (typeof weekday !== "number" || weekday < 0 || weekday > 6) {
        throw new Error(
          "weekday must be a number between 0 (Sunday) and 6 (Saturday)."
        );
      }
      if (typeof month !== "number" || month < 0 || month > 11) {
        throw new Error(
          "month must be a number between 0 (January) and 11 (December)."
        );
      }
      if (typeof year !== "number") {
        throw new Error("year must be a valid number.");
      }

      let firstDay = new Date(year, month, 1); // Get the first day of the month
      let firstDayWeekday = getDay(firstDay); // Get the weekday of the first day

      let daysToAdd = (weekday + 7 - firstDayWeekday) % 7; // Calculate days to reach the first occurrence of the weekday
      firstDay = addDays(firstDay, daysToAdd); // Set to the first occurrence of the weekday

      const nthWeekday = addDays(firstDay, 7 * (n - 1)); // Add 7 days for each subsequent occurrence to get the nth weekday
      return nthWeekday;
    } catch (error) {
      console.error(`Error in getNthWeekdayInMonth method: ${error.message}`);
      return null;
    }
  }

  /**
   * Check if a date is a holiday based on a list of custom holidays
   *
   * @param {Date} date - The date to check.
   * @param {Array} holidayList - An array of holiday `Date` objects.
   * @returns {boolean} - Returns `true` if the date is a holiday, otherwise `false`.
   *
   * Example:
   *   DateBusinessLogic.isHoliday(new Date('2025-01-01'), [new Date('2025-01-01')]) // true
   */
  static isHoliday(date, holidayList) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (!Array.isArray(holidayList)) {
        throw new Error("holidayList must be an array of Date objects.");
      }

      return holidayList.some(
        (holiday) => holiday.getTime() === date.getTime()
      ); // Check if the date matches any holiday in the list
    } catch (error) {
      console.error(`Error in isHoliday method: ${error.message}`);
      return false;
    }
  }

  /**
   * Add a certain number of business days to a given date (skipping weekends)
   *
   * @param {Date} date - The starting date.
   * @param {number} n - The number of business days to add. Can be negative to subtract business days.
   * @returns {Date} - The date after adding `n` business days.
   *
   * Example:
   *   DateBusinessLogic.addBusinessDays(new Date(), 5) // Adds 5 business days to the current date
   */
  static addBusinessDays(date, n) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof n !== "number" || n === 0) {
        throw new Error("n must be a valid number.");
      }

      let currentDate = date;
      let addedDays = 0;

      while (addedDays < Math.abs(n)) {
        currentDate = addDays(currentDate, n > 0 ? 1 : -1); // Increment or decrement by 1 day
        if (this.isBusinessDay(currentDate)) {
          addedDays++; // Only count business days
        }
      }
      return currentDate;
    } catch (error) {
      console.error(`Error in addBusinessDays method: ${error.message}`);
      return null;
    }
  }
}
