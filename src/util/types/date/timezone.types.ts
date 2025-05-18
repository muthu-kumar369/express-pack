export interface DateUtilTimezoneInterface {
  convertToTZ(date: Date, timezone: string): Date | null;
  getTimezone(): string | null;
  withLocale(date: Date, locale: string): string | null;
  getTimezoneAbbr(date: Date): string | null;
  getTimezoneOffsetMinutes(date: Date): number | null;
}
