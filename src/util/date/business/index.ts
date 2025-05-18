// DateUtilBusiness.ts

import { HolidayList } from "@/util/types";
import { addDays, getDay } from "date-fns";

export class DateUtilBusiness {
  static isBusinessDay(date: Date): boolean {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      const day = getDay(date);
      return day !== 0 && day !== 6;
    } catch (error: any) {
      console.error(`Error in isBusinessDay method: ${error.message}`);
      return false;
    }
  }

  static nextBusinessDay(date: Date): Date | null {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }

      let nextDay = addDays(date, 1);
      while (!this.isBusinessDay(nextDay)) {
        nextDay = addDays(nextDay, 1);
      }
      return nextDay;
    } catch (error: any) {
      console.error(`Error in nextBusinessDay method: ${error.message}`);
      return null;
    }
  }

  static getNthWeekdayInMonth(
    n: number,
    weekday: number,
    month: number,
    year: number
  ): Date | null {
    try {
      if (typeof n !== "number" || n <= 0) {
        throw new Error("n must be a positive integer.");
      }
      if (typeof weekday !== "number" || weekday < 0 || weekday > 6) {
        throw new Error("weekday must be a number between 0 and 6.");
      }
      if (typeof month !== "number" || month < 0 || month > 11) {
        throw new Error("month must be between 0 and 11.");
      }
      if (typeof year !== "number") {
        throw new Error("year must be a valid number.");
      }

      let firstDay = new Date(year, month, 1);
      let firstDayWeekday = getDay(firstDay);
      let daysToAdd = (weekday + 7 - firstDayWeekday) % 7;
      firstDay = addDays(firstDay, daysToAdd);

      return addDays(firstDay, 7 * (n - 1));
    } catch (error: any) {
      console.error(`Error in getNthWeekdayInMonth method: ${error.message}`);
      return null;
    }
  }

  static isHoliday(date: Date, holidayList: HolidayList): boolean {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (!Array.isArray(holidayList)) {
        throw new Error("holidayList must be an array of Date objects.");
      }

      return holidayList.some(
        (holiday) => holiday.getTime() === date.getTime()
      );
    } catch (error: any) {
      console.error(`Error in isHoliday method: ${error.message}`);
      return false;
    }
  }

  static addBusinessDays(date: Date, n: number): Date | null {
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
        currentDate = addDays(currentDate, n > 0 ? 1 : -1);
        if (this.isBusinessDay(currentDate)) {
          addedDays++;
        }
      }
      return currentDate;
    } catch (error: any) {
      console.error(`Error in addBusinessDays method: ${error.message}`);
      return null;
    }
  }
}
