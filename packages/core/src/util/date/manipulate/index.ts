import {
  addDays,
  addMonths,
  addYears,
  addWeeks,
  addHours,
  addMinutes,
  addSeconds,
  subDays,
  subMonths,
  subYears,
  subWeeks,
  subHours,
  subMinutes,
  subSeconds,
  setYear,
  setMonth,
  setDate as setDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
} from "date-fns";

import type {
  DateAddSubtractUnit,
  DateSetUnit,
  DateStartEndUnit,
} from "../../types";

const addMap: Record<
  DateAddSubtractUnit,
  (date: Date, amount: number) => Date
> = {
  days: addDays,
  months: addMonths,
  years: addYears,
  weeks: addWeeks,
  hours: addHours,
  minutes: addMinutes,
  seconds: addSeconds,
};

const subMap: Record<
  DateAddSubtractUnit,
  (date: Date, amount: number) => Date
> = {
  days: subDays,
  months: subMonths,
  years: subYears,
  weeks: subWeeks,
  hours: subHours,
  minutes: subMinutes,
  seconds: subSeconds,
};

const setMap: Record<DateSetUnit, (date: Date, value: number) => Date> = {
  year: setYear,
  month: setMonth,
  day: setDay,
  hour: setHours,
  minute: setMinutes,
  second: setSeconds,
};

const startMap: Record<DateStartEndUnit, (date: Date) => Date> = {
  day: startOfDay,
  month: startOfMonth,
  week: startOfWeek,
  year: startOfYear,
};

const endMap: Record<DateStartEndUnit, (date: Date) => Date> = {
  day: endOfDay,
  month: endOfMonth,
  week: endOfWeek,
  year: endOfYear,
};

export class DateUtilManipulate {
  static add(
    date: Date,
    value: number,
    unit: DateAddSubtractUnit
  ): Date | null {
    try {
      const fn = addMap[unit];
      return fn(date, value);
    } catch (error: any) {
      console.error(`Error in add: ${error.message}`);
      return null;
    }
  }

  static subtract(
    date: Date,
    value: number,
    unit: DateAddSubtractUnit
  ): Date | null {
    try {
      const fn = subMap[unit];
      return fn(date, value);
    } catch (error: any) {
      console.error(`Error in subtract: ${error.message}`);
      return null;
    }
  }

  static set(date: Date, unit: DateSetUnit, value: number): Date | null {
    try {
      const fn = setMap[unit];
      return fn(date, value);
    } catch (error: any) {
      console.error(`Error in set: ${error.message}`);
      return null;
    }
  }

  static startOf(date: Date, unit: DateStartEndUnit): Date | null {
    try {
      const fn = startMap[unit];
      return fn(date);
    } catch (error: any) {
      console.error(`Error in startOf: ${error.message}`);
      return null;
    }
  }

  static endOf(date: Date, unit: DateStartEndUnit): Date | null {
    try {
      const fn = endMap[unit];
      return fn(date);
    } catch (error: any) {
      console.error(`Error in endOf: ${error.message}`);
      return null;
    }
  }

  static clone(date: Date): Date | null {
    try {
      if (!(date instanceof Date)) throw new Error("Invalid Date object.");
      return new Date(date.getTime());
    } catch (error: any) {
      console.error(`Error in clone: ${error.message}`);
      return null;
    }
  }
}
