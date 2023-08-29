import { constant } from "./constant";
import dayjs from "dayjs";
import type { KhmercalType } from "../types/lunar";
import { khmerNewYear } from "./khmerNewYear";

// Khmer date format handler
const formatKhmerDate = (
  KhmerLunar: KhmercalType,
  date: dayjs.Dayjs,
  format?: string | string | null | undefined,
): string | undefined => {
  if (format === null || format === undefined || format === "") {
    // Default date format
    const dayOfWeek = date.day();
    const beYear = KhmerLunar.years.BE;
    const animalYear = constant.kh.animalYear[khmerNewYear.getAnimalYear(date)];
    const eraYear = khmerNewYear.getJolakSakarajYear(date) % 10;
    return constant.kh.postformat(
      `ថ្ងៃ${constant.kh.weekdays[dayOfWeek]} ${KhmerLunar.period.day}${KhmerLunar.period.moon} ខែ${KhmerLunar.month.name} ឆ្នាំ${animalYear} ${constant.kh.eraYear[eraYear]} ពុទ្ធសករាជ ${beYear}`,
    );
  } else if (typeof format === "string") {
    const formatRules: { [key: string]: () => any } = {
      W: () => {
        return constant.kh.weekdays[date.day()];
      },
      w: () => {
        return constant.kh.weekdaysShort[date.day()];
      },
      d: () => {
        return KhmerLunar.period.day;
      },
      D: () => {
        const moonDay = KhmerLunar.period.day;
        return ("" + moonDay).length === 1 ? `០${moonDay}` : moonDay;
      },
      N: () => {
        return KhmerLunar.period.moon;
      },
      n: () => {
        return KhmerLunar.period.moon === "កើត" ? "ក" : "រ";
      },
      o: () => {
        return constant.kh.moonDays[KhmerLunar.day];
      },
      m: () => {
        return KhmerLunar.month.name;
      },
      M: () => {
        return constant.kh.months[date.month()];
      },
      a: () => {
        return constant.kh.animalYear[khmerNewYear.getAnimalYear(date)];
      },
      e: () => {
        return constant.kh.eraYear[khmerNewYear.getJolakSakarajYear(date) % 10];
      },
      b: () => {
        return KhmerLunar.years.BE;
      },
      c: () => {
        return date.year();
      },
      j: () => {
        return KhmerLunar.years.JE;
      },
    };
    return constant.kh.postformat(
      format.replace(new RegExp(Object.keys(formatRules).join("|"), "g"), (m) =>
        formatRules[m](),
      ),
    );
  }
};
export const utils = {
  formatKhmerDate: formatKhmerDate,
};
