export interface CreateDateOptions {
  value: string | Date;
  format?: string;
  timezone?: string;
}

export interface DateParts {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  timezone?: string;
}
