import { DateInput } from "@/util/types";
import { isValid, max, min } from "date-fns";

export class DateUtilEdgeCase {
  static handleInvalidFallback(date: DateInput, fallback: Date): Date | null {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return isValid(d) ? d : fallback;
    } catch (error) {
      console.error(
        `Error in handleInvalidFallback method: ${
          error instanceof Error ? error.message : error
        }`
      );
      return null;
    }
  }

  static normalizeDateInput(input: DateInput): Date | null {
    try {
      const date = input instanceof Date ? input : new Date(input);
      return isValid(date) ? date : null;
    } catch (error) {
      console.error(
        `Error in normalizeDateInput method: ${
          error instanceof Error ? error.message : error
        }`
      );
      return null;
    }
  }

  static getMaxDate(...dates: Date[]): Date | null {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && isValid(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return max(validDates);
    } catch (error) {
      console.error(
        `Error in getMaxDate method: ${
          error instanceof Error ? error.message : error
        }`
      );
      return null;
    }
  }

  static getMinDate(...dates: Date[]): Date | null {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && isValid(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return min(validDates);
    } catch (error) {
      console.error(
        `Error in getMinDate method: ${
          error instanceof Error ? error.message : error
        }`
      );
      return null;
    }
  }

  static isAmbiguousDST(date: Date): boolean {
    try {
      const oneMinuteLater = new Date(date.getTime() + 60 * 1000);
      const offsetNow = date.getTimezoneOffset();
      const offsetLater = oneMinuteLater.getTimezoneOffset();
      return offsetNow !== offsetLater && offsetNow > offsetLater;
    } catch (error) {
      console.error(
        `Error in isAmbiguousDST method: ${
          error instanceof Error ? error.message : error
        }`
      );
      return false;
    }
  }
}
