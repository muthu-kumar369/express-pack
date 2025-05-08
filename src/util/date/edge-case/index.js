import { isValid, max, min } from "date-fns";

export class DateUtilEdgeCase {
  /**
   * Provide fallback for invalid dates, returns a valid date or null if invalid
   *
   * @param {any} date - The input date (can be Date object, string, or timestamp).
   * @param {Date} fallback - The fallback date to return in case of invalid input.
   * @returns {Date|null} - Returns a valid date object or null if invalid.
   *
   * Example:
   *   EdgeCaseUtils.handleInvalidFallback(new Date('Invalid Date'), new Date('2025-01-01'))
   *   // Returns 2025-01-01 because the input date is invalid
   */
  static handleInvalidFallback(date, fallback) {
    try {
      return isValid(date) ? date : fallback; // If date is invalid, return fallback date
    } catch (error) {
      console.error(`Error in handleInvalidFallback method: ${error.message}`);
      return null;
    }
  }

  /**
   * Normalize various types of date input (Date, string, timestamp) into a standard Date object.
   *
   * @param {any} input - The input value to be normalized (could be Date, string, or timestamp).
   * @returns {Date|null} - Returns a Date object or null if input is invalid.
   *
   * Example:
   *   EdgeCaseUtils.normalizeDateInput('2025-01-01')
   *   // Returns Date object corresponding to 2025-01-01
   */
  static normalizeDateInput(input) {
    try {
      let date;
      if (input instanceof Date) {
        date = input;
      } else if (typeof input === "string" || typeof input === "number") {
        date = new Date(input);
      } else {
        throw new Error("Invalid input type.");
      }
      return isValid(date) ? date : null; // Return the normalized Date or null if invalid
    } catch (error) {
      console.error(`Error in normalizeDateInput method: ${error.message}`);
      return null;
    }
  }

  /**
   * Return the maximum date from a list of multiple dates.
   *
   * @param {...Date} dates - Multiple date arguments to compare.
   * @returns {Date|null} - Returns the maximum date or null if no valid date is passed.
   *
   * Example:
   *   EdgeCaseUtils.getMaxDate(new Date('2025-01-01'), new Date('2025-01-03'), new Date('2025-01-02'))
   *   // Returns 2025-01-03, as it is the latest date
   */
  static getMaxDate(...dates) {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && isValid(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return max(validDates); // Get the maximum date from the valid dates
    } catch (error) {
      console.error(`Error in getMaxDate method: ${error.message}`);
      return null;
    }
  }

  /**
   * Return the minimum date from a list of multiple dates.
   *
   * @param {...Date} dates - Multiple date arguments to compare.
   * @returns {Date|null} - Returns the minimum date or null if no valid date is passed.
   *
   * Example:
   *   EdgeCaseUtils.getMinDate(new Date('2025-01-01'), new Date('2025-01-03'), new Date('2025-01-02'))
   *   // Returns 2025-01-01, as it is the earliest date
   */
  static getMinDate(...dates) {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && isValid(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return min(validDates); // Get the minimum date from the valid dates
    } catch (error) {
      console.error(`Error in getMinDate method: ${error.message}`);
      return null;
    }
  }

  /**
   * Check if there is ambiguity in Daylight Saving Time (DST), e.g., overlapping hour.
   *
   * This happens during the end of DST (typically in fall), when the clock goes backward,
   * and a local hour (like 1:30 AM) occurs twice with two different offsets.
   *
   * @param {Date} date - The local date to check for DST ambiguity.
   * @returns {boolean} - Returns `true` if the local time is ambiguous due to DST.
   */
  static isAmbiguousDST(date) {
    try {
      // Clone the original date
      const oneMinuteLater = new Date(date.getTime() + 60 * 1000);

      // Compare the timezone offsets
      const offsetNow = date.getTimezoneOffset();
      const offsetLater = oneMinuteLater.getTimezoneOffset();

      // Ambiguity is detected if the offset changes between these two times
      return offsetNow !== offsetLater && offsetNow > offsetLater;
    } catch (error) {
      console.error(`Error in isAmbiguousDST method: ${error.message}`);
      return false;
    }
  }
}
