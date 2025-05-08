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
  // Units: 'milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'
  // Example: diff(date2, 'days') gets the difference in days between date1 and date2
  static diff(date1, date2, unit, float = false) {
    try {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        throw new Error("Both inputs must be valid Date objects.");
      }
      if (!unit || typeof unit !== "string") {
        throw new Error(
          'Unit must be a valid string (e.g., "days", "months").'
        );
      }

      let diff;
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

      // If float is true, return the float value
      return float ? diff : Math.floor(diff);
    } catch (error) {
      console.error(`Error in diff method: ${error.message}`);
      return null;
    }
  }

  // Returns an object with days, hours, minutes, seconds, etc. between from and to
  static duration(from, to) {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }

      const diffInMs = Math.abs(to - from);
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    } catch (error) {
      console.error(`Error in duration method: ${error.message}`);
      return null;
    }
  }

  // Returns the relative time from now (e.g., "3 days ago", "in 5 hours")
  static fromNow(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error(`Error in fromNow method: ${error.message}`);
      return null;
    }
  }

  // Count non-weekend days between from and to
  static countWeekdays(from, to) {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }

      const weekdays = eachDayOfInterval({ start: from, end: to }).filter(
        (date) => {
          const day = date.getDay();
          return day !== 0 && day !== 6; // Exclude weekends (0 = Sunday, 6 = Saturday)
        }
      );

      return weekdays.length;
    } catch (error) {
      console.error(`Error in countWeekdays method: ${error.message}`);
      return null;
    }
  }
}
