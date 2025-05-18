import {
  eachDayOfInterval,
  differenceInCalendarDays,
  isWithinInterval,
  addDays,
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
} from "date-fns";

import type { DateRange, ChunkUnit } from "@/util/types";

export class DateUtilsRange {
  /**
   * Get all dates in a range from start date to end date
   */
  static getDateRange(start: Date, end: Date): Date[] {
    try {
      if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error("start and end must be valid Date objects.");
      }
      return eachDayOfInterval({ start, end });
    } catch (error: any) {
      console.error(`Error in getDateRange method: ${error.message}`);
      return [];
    }
  }

  /**
   * Chunk a range of dates into periods by the specified unit (e.g., days, weeks, months)
   */
  static chunkBy(dateRange: Date[], unit: ChunkUnit): Date[][] {
    try {
      if (!Array.isArray(dateRange)) {
        throw new Error("dateRange must be an array of Date objects.");
      }
      if (
        typeof unit !== "string" ||
        !["day", "week", "month"].includes(unit)
      ) {
        throw new Error('unit must be one of: "day", "week", or "month".');
      }

      if (unit === "day") {
        return dateRange.map((date) => [date]);
      }

      if (unit === "week") {
        const weeks: Date[][] = [];
        let startOfWeekDate = startOfWeek(dateRange[0]);
        let endOfWeekDate = endOfWeek(dateRange[0]);

        while (startOfWeekDate <= dateRange[dateRange.length - 1]) {
          const weekRange = eachDayOfInterval({
            start: startOfWeekDate,
            end: endOfWeekDate,
          });
          weeks.push(weekRange);
          startOfWeekDate = addDays(startOfWeekDate, 7);
          endOfWeekDate = addDays(endOfWeekDate, 7);
        }
        return weeks;
      }

      if (unit === "month") {
        const months: Date[][] = [];
        const monthRange = eachMonthOfInterval({
          start: dateRange[0],
          end: dateRange[dateRange.length - 1],
        });
        for (let i = 0; i < monthRange.length; i++) {
          months.push(
            eachDayOfInterval({
              start: monthRange[i],
              end: addDays(
                monthRange[i],
                differenceInCalendarDays(monthRange[i], monthRange[i + 1]) - 1
              ),
            })
          );
        }
        return months;
      }

      return [];
    } catch (error: any) {
      console.error(`Error in chunkBy method: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if two date ranges intersect (i.e., overlap)
   */
  static intersectRanges(r1: DateRange, r2: DateRange): boolean {
    try {
      if (
        !Array.isArray(r1) ||
        !Array.isArray(r2) ||
        r1.length !== 2 ||
        r2.length !== 2
      ) {
        throw new Error(
          "Both date ranges must be arrays containing two Date objects."
        );
      }

      const [start1, end1] = r1;
      const [start2, end2] = r2;

      if (
        !(start1 instanceof Date) ||
        !(end1 instanceof Date) ||
        !(start2 instanceof Date) ||
        !(end2 instanceof Date)
      ) {
        throw new Error(
          "All elements of the date ranges must be valid Date objects."
        );
      }

      return (
        isWithinInterval(start1, { start: start2, end: end2 }) ||
        isWithinInterval(end1, { start: start2, end: end2 }) ||
        isWithinInterval(start2, { start: start1, end: end1 }) ||
        isWithinInterval(end2, { start: start1, end: end1 })
      );
    } catch (error: any) {
      console.error(`Error in intersectRanges method: ${error.message}`);
      return false;
    }
  }

  /**
   * Merge multiple date ranges, ensuring no overlaps remain
   */
  static mergeRanges(ranges: DateRange[]): DateRange[] {
    try {
      if (!Array.isArray(ranges)) {
        throw new Error("ranges must be an array of date range arrays.");
      }

      ranges.sort((a, b) => a[0].getTime() - b[0].getTime());

      const mergedRanges: DateRange[] = [];
      let currentRange = ranges[0];

      for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];

        if (nextRange[0] <= currentRange[1]) {
          currentRange[1] =
            nextRange[1] > currentRange[1] ? nextRange[1] : currentRange[1];
        } else {
          mergedRanges.push(currentRange);
          currentRange = nextRange;
        }
      }

      mergedRanges.push(currentRange);
      return mergedRanges;
    } catch (error: any) {
      console.error(`Error in mergeRanges method: ${error.message}`);
      return [];
    }
  }
}
