import { TimeUnit } from "@/util/types";
import {
  isBefore as compareBefore,
  isAfter as compareAfter,
  isEqual as isSame,
  compareAsc,
  isWithinInterval,
} from "date-fns";

export class DateUtilCompare {
  static isBefore(date: Date, otherDate: Date, unit?: TimeUnit): boolean {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }

      return compareBefore(dateCopy, otherDateCopy);
    }

    return compareBefore(date, otherDate);
  }

  static isAfter(date: Date, otherDate: Date, unit?: TimeUnit): boolean {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }

      return compareAfter(dateCopy, otherDateCopy);
    }

    return compareAfter(date, otherDate);
  }

  static isSame(date: Date, otherDate: Date, unit?: TimeUnit): boolean {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);

      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }

      return isSame(dateCopy, otherDateCopy);
    }

    return isSame(date, otherDate);
  }

  static compare(date: Date, otherDate: Date): number {
    return compareAsc(date, otherDate);
  }

  static isBetween(date: Date, start: Date, end: Date): boolean {
    return isWithinInterval(date, { start, end });
  }
}
