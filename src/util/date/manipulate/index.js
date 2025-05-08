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

const addMap = {
  days: addDays,
  months: addMonths,
  years: addYears,
  weeks: addWeeks,
  hours: addHours,
  minutes: addMinutes,
  seconds: addSeconds,
};

const subMap = {
  days: subDays,
  months: subMonths,
  years: subYears,
  weeks: subWeeks,
  hours: subHours,
  minutes: subMinutes,
  seconds: subSeconds,
};

const setMap = {
  year: setYear,
  month: setMonth,
  day: setDay,
  hour: setHours,
  minute: setMinutes,
  second: setSeconds,
};

const startMap = {
  day: startOfDay,
  month: startOfMonth,
  week: startOfWeek,
  year: startOfYear,
};

const endMap = {
  day: endOfDay,
  month: endOfMonth,
  week: endOfWeek,
  year: endOfYear,
};

export class DateUtilManipulate {
  /**
   * Add time to a date
   * @param {Date} date - The original date
   * @param {number} value - Positive or negative number to add
   * @param {'days'|'months'|'years'|'weeks'|'hours'|'minutes'|'seconds'} unit - Unit of time
   * @returns {Date|null} - New date with time added, or null on error
   */
  static add(date, value, unit) {
    try {
      const fn = addMap[unit];
      if (!fn) throw new Error(`Unsupported unit: ${unit}`);
      return fn(date, value);
    } catch (error) {
      console.error(`Error in add: ${error.message}`);
      return null;
    }
  }

  /**
   * Subtract time from a date
   * @param {Date} date - The original date
   * @param {number} value - Positive or negative number to subtract
   * @param {'days'|'months'|'years'|'weeks'|'hours'|'minutes'|'seconds'} unit - Unit of time
   * @returns {Date|null} - New date with time subtracted, or null on error
   */
  static subtract(date, value, unit) {
    try {
      const fn = subMap[unit];
      if (!fn) throw new Error(`Unsupported unit: ${unit}`);
      return fn(date, value);
    } catch (error) {
      console.error(`Error in subtract: ${error.message}`);
      return null;
    }
  }

  /**
   * Set a specific part of the date (e.g., year, month, day)
   * @param {Date} date - The original date
   * @param {'year'|'month'|'day'|'hour'|'minute'|'second'} unit - Part of the date to set
   * @param {number} value - Value to set for the unit
   * @returns {Date|null} - New date with the unit set, or null on error
   */
  static set(date, unit, value) {
    try {
      const fn = setMap[unit];
      if (!fn) throw new Error(`Unsupported unit: ${unit}`);
      return fn(date, value);
    } catch (error) {
      console.error(`Error in set: ${error.message}`);
      return null;
    }
  }

  /**
   * Get the start of a unit (e.g., start of month)
   * @param {Date} date - The original date
   * @param {'day'|'month'|'week'|'year'} unit - Unit to get the start of
   * @returns {Date|null} - Date at the start of the given unit, or null on error
   */
  static startOf(date, unit) {
    try {
      const fn = startMap[unit];
      if (!fn) throw new Error(`Unsupported unit: ${unit}`);
      return fn(date);
    } catch (error) {
      console.error(`Error in startOf: ${error.message}`);
      return null;
    }
  }

  /**
   * Get the end of a unit (e.g., end of week)
   * @param {Date} date - The original date
   * @param {'day'|'month'|'week'|'year'} unit - Unit to get the end of
   * @returns {Date|null} - Date at the end of the given unit, or null on error
   */
  static endOf(date, unit) {
    try {
      const fn = endMap[unit];
      if (!fn) throw new Error(`Unsupported unit: ${unit}`);
      return fn(date);
    } catch (error) {
      console.error(`Error in endOf: ${error.message}`);
      return null;
    }
  }

  /**
   * Clone a date object
   * @param {Date} date - Date to clone
   * @returns {Date|null} - New copy of the date, or null if input is invalid
   */
  static clone(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Invalid Date object.");
      }
      return new Date(date.getTime());
    } catch (error) {
      console.error(`Error in clone: ${error.message}`);
      return null;
    }
  }
}
