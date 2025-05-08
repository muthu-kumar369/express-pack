import { toZonedTime } from "date-fns-tz";
import { format as formatDate } from "date-fns";

export class DateUtilTimezone {
  // Convert to another timezone (unit: string, e.g., 'America/New_York')
  static convertToTZ(date, timezone) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof timezone !== "string") {
        throw new Error("Timezone must be a valid string.");
      }

      // Convert to the desired timezone
      const zonedDate = toZonedTime(date, timezone);
      return zonedDate;
    } catch (error) {
      console.error(`Error in convertToTZ method: ${error.message}`);
      return null;
    }
  }

  // Get current timezone (e.g., 'America/New_York')
  static getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error(`Error in getTimezone method: ${error.message}`);
      return null;
    }
  }

  // Return date with specified locale (e.g., 'en-US', 'fr-FR')
  static withLocale(date, locale) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof locale !== "string") {
        throw new Error("Locale must be a valid string.");
      }

      // Format the date with the specified locale
      return formatDate(date, "P", { locale: new Intl.Locale(locale) });
    } catch (error) {
      console.error(`Error in withLocale method: ${error.message}`);
      return null;
    }
  }

  // Get timezone abbreviation (e.g., IST, PDT)
  static getTimezoneAbbr(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      // Get the abbreviation using Date's toLocaleString
      const timeZoneAbbr = date
        .toLocaleString("en-US", { timeZoneName: "short" })
        .split(" ")[2];
      return timeZoneAbbr;
    } catch (error) {
      console.error(`Error in getTimezoneAbbr method: ${error.message}`);
      return null;
    }
  }

  // Get timezone offset in minutes (e.g., 330 for IST)
  static getTimezoneOffsetMinutes(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      // Get the offset in minutes
      const offset = date.getTimezoneOffset();
      return -offset; // The getTimezoneOffset returns minutes behind UTC, so we negate it
    } catch (error) {
      console.error(
        `Error in getTimezoneOffsetMinutes method: ${error.message}`
      );
      return null;
    }
  }
}
