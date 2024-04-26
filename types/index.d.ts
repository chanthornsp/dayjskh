// add type to support dayjs
/// <reference types="dayjskh" />
import type { Dayjs, PluginFunc } from "dayjs/index";

declare const plugin: PluginFunc;
export = plugin;
declare namespace plugin {
  export interface toKhmerDate {
    toKhmerDate(format?: string): string;
    khBeta(format?: string): string;
    khNewYear(): {
      date: dayjs.Dayjs;
      days: number;
      dates: { date: dayjs.Dayjs; dayName: string }[];
    };
  }
}

declare module "dayjs" {
  interface Dayjs extends plugin.toKhmerDate {}
}
