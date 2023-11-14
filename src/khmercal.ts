// Source code from: https://github.com/seanghay/khmercal

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export function lunar(date: string | Dayjs = dayjs()) {
  const aharakoune = (y: number): number => (y * 292207 + 373) % 800;
  const harakoune = (y: number): number =>
    Math.floor((y * 292207 + 373) / 800) + 1;
  const avomane = (y: number): number => (11 * harakoune(y) + 650) % 692;
  const regularLeap = (y: number): boolean => 800 - aharakoune(y) <= 207;

  function bodethey(y: number): number {
    const ha = harakoune(y);
    return (ha + Math.floor((11 * ha + 650) / 692)) % 30;
  }

  function lunarDiffDays(end: Dayjs): number {
    let count = 0;
    let x = 1970 - 638 + 1;
    let y = end.year() - 638;
    if (x > y) {
      let _x = x;
      x = y;
      y = _x;
    }
    while (x < y) count += daysInYear(x++);
    return count;
  }

  function daysInYear(year: number): number {
    if (jaisLeap(year)) return 384;
    if (greatLeap(year)) return 355;
    return 354;
  }

  function jaisLeap(y: number): boolean {
    const b0 = bodethey(y);
    const b1 = bodethey(y + 1);
    return (
      b0 > 24 || b0 < 6 || (b0 === 24 && b1 === 6) || (b0 === 25 && b1 === 5)
    );
  }

  function langSak(y: number) {
    const i = sakDay(y);
    return { month: 3 + Number(i >= 6 && i <= 29), day: i };
  }

  function sakDay(y: number) {
    const bo = bodethey(y);
    const bl0 = jaisLeap(y - 1);
    if (!bl0 || (bl0 && !isProtetinLeap(y - 1))) {
      if (bo < 6) return bo + 1;
      return bo;
    }
    return bo + 1;
  }

  function greatLeap(y: number): boolean {
    let value = isProtetinLeap(y);
    if (jaisLeap(y) && value) value = false;
    return value;
  }

  function isProtetinLeap(y: number): boolean {
    const avomane0 = avomane(y);
    const avomane1 = avomane(y + 1);
    const normal = regularLeap(y);
    let value = normal && avomane0 < 127;

    if (!normal) {
      if (avomane0 === 137 && avomane1 === 0) value = false;
      else if (avomane0 < 138) value = true;
    }

    if (!value) value = isProtetinLeap(y - 1) && jaisLeap(y - 1);
    return value;
  }

  function diffDays(end: Dayjs): number {
    const result = Math.abs(
      Math.round((end.valueOf() - 286596e5) / (1000 * 60 * 60 * 24)),
    );
    return result;
  }

  function monthsOfYear(year: number): number[] {
    const ath = jaisLeap(year);
    const great = greatLeap(year);
    const items = [];
    for (let i = 0; i < 12 + Number(ath); i++) {
      let j = i;
      if (ath && j >= 8) j--;
      // items.push(29 + Number(j % 2 != 0) + ((j === 6 && great) | 0));
      items.push(29 + Number(j % 2 != 0) + (j === 6 && great ? 1 : 0));
    }
    return items;
  }

  if (typeof date === "string") {
    date = dayjs(date);
  }

  date = date.subtract(7, "hour");
  const CE = date.year();
  let y = CE - 638;

  let day = Math.abs(diffDays(date) - lunarDiffDays(date)) + 1;
  const BE = CE + 543 + Number(day > 162);

  const len = daysInYear(y);

  if (day > len) {
    day -= len;
    y++;
  }

  let m = 0;
  const lengthOfYear = monthsOfYear(y);
  for (const month of lengthOfYear) {
    if (day <= month) break;
    day -= month;
    m++;
  }

  const sak = langSak(y - 1);
  const JE =
    y - 1 - Number(sak.month > m || (sak.month === m && sak.day > date.date()));

  const yearMonths = [
    "មិគសិរ",
    "បុស្ស",
    "មាឃ",
    "ផល្គុន",
    "ចេត្រ",
    "ពិសាខ",
    "ជេស្ឋ",
    "អាសាឍ",
    "បឋមាសាឍ",
    "ទុតិយាសាឍ",
    "ស្រាពណ៍",
    "ភទ្របទ",
    "អស្សុជ",
    "កត្តិក",
  ].filter((_, i) => {
    if (lengthOfYear.length == 12) return i != 8 && i != 9;
    else return i != 7;
  });

  const ZODIAC_YEARS = [
    "ជូត",
    "ឆ្លូវ",
    "ខាល",
    "ថោះ",
    "រោង",
    "ម្សាញ់",
    "មមីរ",
    "មមែ",
    "វក",
    "រកា",
    "ច",
    "កុរ",
  ];

  // const SAK = [
  //   "ឯកស័ក",
  //   "ទោស័ក",
  //   "ត្រីស័ក",
  //   "ចត្វាស័ក",
  //   "បញ្ចស័ក",
  //   "ឆស័ក",
  //   "សប្តស័ក",
  //   "អដ្ឋស័ក",
  //   "នព្វស័ក",
  //   "សំរឹទ្ធិស័ក",
  // ];

  return {
    day,
    period: {
      day: ((day - 1) % 15) + 1,
      moon: day > 15 ? "រោច" : "កើត",
    },
    // sequence: (((JE + 1) % 10) + 9) % 10,
    // sak: SAK[(((JE + 1) % 10) + 9) % 10],
    zodiac: ZODIAC_YEARS[(((JE + 1) % 12) + 10) % 12],
    years: {
      JE,
      CE,
      BE,
    },
    length: len,
    monthLength: lengthOfYear[m],
    month: { name: yearMonths[m], index: m },
    months: yearMonths,
  };
}
