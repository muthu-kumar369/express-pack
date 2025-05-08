import {
  eachDayOfInterval,
  differenceInCalendarDays,
  isWithinInterval,
  addDays,
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
} from "date-fns";

export class DateUtilsRange {
  /**
   * Get all dates in a range from start date to end date
   *
   * @param {Date} start - The start date of the range.
   * @param {Date} end - The end date of the range.
   * @returns {Date[]} - An array of Date objects representing all dates in the range.
   *
   * Example:
   *   DateRangeUtils.getDateRange(new Date('2025-01-01'), new Date('2025-01-05'))
   *   // Returns [2025-01-01, 2025-01-02, 2025-01-03, 2025-01-04, 2025-01-05]
   */
  static getDateRange(start, end) {
    try {
      if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error("start and end must be valid Date objects.");
      }
      return eachDayOfInterval({ start, end }); // Get all dates between the two provided dates
    } catch (error) {
      console.error(`Error in getDateRange method: ${error.message}`);
      return [];
    }
  }

  /**
   * Chunk a range of dates into periods by the specified unit (e.g., days, weeks, months)
   *
   * @param {Date[]} dateRange - Array of Date objects representing the range of dates.
   * @param {string} unit - The unit by which to chunk the range (e.g., 'day', 'week', 'month').
   * @returns {Date[][]} - An array of arrays, each representing a chunked period.
   *
   * Example:
   *   DateRangeUtils.chunkBy([new Date('2025-01-01'), new Date('2025-01-05')], 'day')
   *   // Returns [[2025-01-01], [2025-01-02], [2025-01-03], [2025-01-04], [2025-01-05]]
   */
  static chunkBy(dateRange, unit) {
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
        return dateRange.map((date) => [date]); // Return each date as a separate array (chunked by day)
      }

      if (unit === "week") {
        const weeks = [];
        let startOfWeekDate = startOfWeek(dateRange[0]); // Get the start of the first week
        let endOfWeekDate = endOfWeek(dateRange[0]); // Get the end of the first week

        while (startOfWeekDate <= dateRange[dateRange.length - 1]) {
          const weekRange = eachDayOfInterval({
            start: startOfWeekDate,
            end: endOfWeekDate,
          });
          weeks.push(weekRange);
          startOfWeekDate = addDays(startOfWeekDate, 7); // Move to the next week
          endOfWeekDate = addDays(endOfWeekDate, 7); // Move to the next week
        }
        return weeks;
      }

      if (unit === "month") {
        const months = [];
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
    } catch (error) {
      console.error(`Error in chunkBy method: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if two date ranges intersect (i.e., overlap)
   *
   * @param {Date[]} r1 - The first date range, represented as an array of two Date objects [start, end].
   * @param {Date[]} r2 - The second date range, represented as an array of two Date objects [start, end].
   * @returns {boolean} - Returns `true` if the date ranges intersect, otherwise `false`.
   *
   * Example:
   *   DateRangeUtils.intersectRanges([new Date('2025-01-01'), new Date('2025-01-05')], [new Date('2025-01-03'), new Date('2025-01-07')])
   *   // Returns true (the ranges overlap from 2025-01-03 to 2025-01-05)
   */
  static intersectRanges(r1, r2) {
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
    } catch (error) {
      console.error(`Error in intersectRanges method: ${error.message}`);
      return false;
    }
  }

  /**
   * Merge multiple date ranges, ensuring no overlaps remain (overlapping ranges will be merged)
   *
   * @param {Array} ranges - An array of date ranges, where each range is an array of two Date objects [start, end].
   * @returns {Array} - A merged array of date ranges, ensuring no overlaps.
   *
   * Example:
   *   DateRangeUtils.mergeRanges([
   *     [new Date('2025-01-01'), new Date('2025-01-05')],
   *     [new Date('2025-01-04'), new Date('2025-01-10')],
   *     [new Date('2025-01-12'), new Date('2025-01-15')]
   *   ])
   *   // Returns [
   *     [2025-01-01, 2025-01-10],
   *     [2025-01-12, 2025-01-15]
   *   ]
   */
  static mergeRanges(ranges) {
    try {
      if (!Array.isArray(ranges)) {
        throw new Error("ranges must be an array of date range arrays.");
      }

      ranges.sort((a, b) => a[0] - b[0]); // Sort ranges by the start date

      const mergedRanges = [];
      let currentRange = ranges[0];

      for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];

        if (nextRange[0] <= currentRange[1]) {
          // If the ranges overlap, merge them
          currentRange[1] =
            nextRange[1] > currentRange[1] ? nextRange[1] : currentRange[1];
        } else {
          // No overlap, add the current range and move to the next
          mergedRanges.push(currentRange);
          currentRange = nextRange;
        }
      }

      mergedRanges.push(currentRange); // Add the last range
      return mergedRanges;
    } catch (error) {
      console.error(`Error in mergeRanges method: ${error.message}`);
      return [];
    }
  }
}
