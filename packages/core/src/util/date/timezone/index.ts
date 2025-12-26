import { toZonedTime } from "date-fns-tz";
import { format as formatDate } from "date-fns";

export class DateUtilTimezone {
  static convertToTZ(date: Date, timezone: string): Date | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof timezone !== "string") {
        throw new Error("Timezone must be a valid string.");
      }

      const zonedDate = toZonedTime(date, timezone);
      return zonedDate;
    } catch (error: any) {
      console.error(`Error in convertToTZ method: ${error.message}`);
      return null;
    }
  }

  static getTimezone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error: any) {
      console.error(`Error in getTimezone method: ${error.message}`);
      return null;
    }
  }

  static withLocale(date: Date, locale: string): string | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof locale !== "string") {
        throw new Error("Locale must be a valid string.");
      }

      // Note: Intl.Locale is supported in modern environments, fallback may be needed for older ones
      return formatDate(date, "P", { locale: new Intl.Locale(locale) as any });
    } catch (error: any) {
      console.error(`Error in withLocale method: ${error.message}`);
      return null;
    }
  }

  static getTimezoneAbbr(date: Date): string | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const timeZoneAbbr = date
        .toLocaleString("en-US", { timeZoneName: "short" })
        .split(" ")[2];
      return timeZoneAbbr;
    } catch (error: any) {
      console.error(`Error in getTimezoneAbbr method: ${error.message}`);
      return null;
    }
  }

  static getTimezoneOffsetMinutes(date: Date): number | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const offset = date.getTimezoneOffset();
      return -offset;
    } catch (error: any) {
      console.error(
        `Error in getTimezoneOffsetMinutes method: ${error.message}`
      );
      return null;
    }
  }
}
