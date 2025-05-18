import { DurationBreakdown, DurationUnit } from "@/util/types";
import {
  differenceInMilliseconds,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  formatDistanceToNow,
  eachDayOfInterval,
} from "date-fns";

export class DateUtilDuration {
  static diff(
    date1: Date,
    date2: Date,
    unit: DurationUnit,
    float: boolean = false
  ): number | null {
    try {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        throw new Error("Both inputs must be valid Date objects.");
      }

      let diff: number;
      switch (unit) {
        case "milliseconds":
          diff = differenceInMilliseconds(date1, date2);
          break;
        case "seconds":
          diff = differenceInSeconds(date1, date2);
          break;
        case "minutes":
          diff = differenceInMinutes(date1, date2);
          break;
        case "hours":
          diff = differenceInHours(date1, date2);
          break;
        case "days":
          diff = differenceInDays(date1, date2);
          break;
        case "weeks":
          diff = differenceInWeeks(date1, date2);
          break;
        case "months":
          diff = differenceInMonths(date1, date2);
          break;
        case "years":
          diff = differenceInYears(date1, date2);
          break;
        default:
          throw new Error("Invalid unit provided.");
      }

      return float ? diff : Math.floor(diff);
    } catch (error: any) {
      console.error(`Error in diff method: ${error.message}`);
      return null;
    }
  }

  static duration(from: Date, to: Date): DurationBreakdown | null {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }

      const diffInMs = Math.abs(to.getTime() - from.getTime());
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    } catch (error: any) {
      console.error(`Error in duration method: ${error.message}`);
      return null;
    }
  }

  static fromNow(date: Date): string | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error: any) {
      console.error(`Error in fromNow method: ${error.message}`);
      return null;
    }
  }

  static countWeekdays(from: Date, to: Date): number | null {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }

      const weekdays = eachDayOfInterval({ start: from, end: to }).filter(
        (date) => {
          const day = date.getDay();
          return day !== 0 && day !== 6;
        }
      );

      return weekdays.length;
    } catch (error: any) {
      console.error(`Error in countWeekdays method: ${error.message}`);
      return null;
    }
  }
}
