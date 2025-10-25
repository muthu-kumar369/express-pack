import {
  isValid as isValidDate,
  parse,
  isLeapYear as checkLeapYear,
  isWeekend as checkWeekend,
  isSameDay as checkSameDay,
} from "date-fns";

export class DateUtilValidate { 
  static isValid(date: Date | string): boolean {
    return isValidDate(date);
  }

  static parseDate(str: string, formats: string[] = []): Date | null {
    let parsedDate: Date | null = null;
    for (const format of formats) {
      parsedDate = parse(str, format, new Date());
      if (isValidDate(parsedDate)) {
        break;
      }
    }
    return parsedDate;
  }

  static isLeapYear(year: number): boolean {
    return checkLeapYear(new Date(year, 0, 1));
  }

  static isDST(date: Date): boolean {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return (
      date.getTimezoneOffset() <
      Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    );
  }

  static isWeekend(date: Date): boolean {
    return checkWeekend(date);
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return checkSameDay(date1, date2);
  }
}
