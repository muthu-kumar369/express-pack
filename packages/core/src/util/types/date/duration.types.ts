export type DurationUnit =
  | "milliseconds"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

export interface DurationBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
