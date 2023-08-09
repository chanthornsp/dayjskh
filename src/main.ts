// Khmer Chhankitek Calendar
// Ref.: https://khmer-calendar.tovnah.com/calendar/toc.php

import { constant } from "./constsant";
import learnSak from "./lerngSak";
import dayjs, { ConfigType } from "dayjs";
import localeData from "dayjs/plugin/localeData";
import km from "dayjs/locale/km";
import updateLocale from "dayjs/plugin/updateLocale";
import duration from "dayjs/plugin/duration";
import tz from "dayjs/plugin/timezone";
import badMutable from "dayjs/plugin/badMutable";

dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.extend(duration);
dayjs.extend(tz);
dayjs.locale(km);
// set default zone to Asia/Phnom_Penh
dayjs.tz.setDefault("Asia/Phnom_Penh");

dayjs.updateLocale("km", {
  // check time unit
  meridiem: function (hour: number) {
    if (hour >= 12) {
      return "ល្ងាច";
    } else {
      return "ព្រឹក";
    }
  },
});

const { lunarMonths, solarMonths, moonStatus, khNewYear } = constant;

export default function dayjskh(date?: ConfigType) {
  const globalDate = date ? dayjs(date) : dayjs();

  const { floor } = Math;
  // Aharkun: អាហារគុណ ឬ ហារគុណ
  // Aharkun is used for Avoman and Bodithey calculation below. Given adYear as a target year in Buddhist Era
  const getAharkun = (beYear: number): number => {
    let t = beYear * 292207 + 499;
    return floor(t / 800) + 4;
  };

  const getAharkunMod = (beYear: number): number => {
    let t = beYear * 292207 + 499;
    return t % 800;
  };

  // Bodithey: បូតិថី
  // Bodithey determines if a given beYear is a leap-month year. Given year target year in Buddhist Era
  const getBodithey = (beYear: number): number => {
    const { avml, aharkun } = {
      avml: floor((11 * getAharkun(beYear) + 25) / 692),
      aharkun: getAharkun(beYear),
    };
    return (avml + aharkun + 29) % 30;
  };

  // Avoman: អាវមាន
  // Avoman determines if a given year is a leap-day year. Given a year in Buddhist Era as denoted as adYear
  const getAvoman = (beYear: number): number => {
    const aharkun = getAharkun(beYear);
    return (11 * aharkun + 25) % 692;
  };

  // Kromathupul
  const khromathupul = (beYear: number): number => {
    const aharkunMod = getAharkunMod(beYear);
    return 800 - aharkunMod;
  };

  // isKhmerSolarLeap
  const isKhmerSolarLeap = (beYear: number): boolean => {
    return khromathupul(beYear) <= 207;
  };

  // Regular if year has 30 day
  // leap month if year has 13 months
  // leap day if Jesth month of the year has 1 extra day
  // leap day and month: both of them
  const getBoditheyLeap = (beYear: number): number => {
    const avoman = getAvoman(beYear);
    const bodithey = getBodithey(beYear);
    const boditheyLeap = bodithey >= 25 || bodithey <= 5 ? 1 : 0;
    const avomanLeap =
      isKhmerSolarLeap(beYear) && avoman <= 126
        ? 1
        : avoman <= 137 && getAvoman(beYear + 1) !== 0
        ? 1
        : 0;
    const result = boditheyLeap + avomanLeap * 2;
    return result;
  };

  // bodithey leap can be both leap-day and leap-month but following the khmer calendar rule, they can't be together on the same year, so leap day must be delayed to next year
  const getProtetinLeap = (beYear: number): number => {
    const boditheyLeap = getBoditheyLeap(beYear);
    switch (boditheyLeap) {
      case 3:
        return 1;
      case 2:
      case 1:
        return boditheyLeap;
      default:
        return getBoditheyLeap(beYear - 1) === 3 ? 2 : 0;
    }
  };

  // A year with an extra day is called Chhantrea Thimeas (ចន្ទ្រាធិមាស) or Adhikavereak (អធិកវារៈ). This year has 355 days.
  const isKhmerLunarLeapDay = (beYear: number): boolean => {
    return getProtetinLeap(beYear) === 2;
  };
  // A year with an extra month is called Adhikameas (អធិកមាស). This year has 384 days.
  const isKhmerLeapMonth = (beYear: number): boolean => {
    return getProtetinLeap(beYear) === 1;
  };

  // is Gregorian Leap Year
  const isGregorianLeapYear = (beYear: number): boolean => {
    return (beYear % 4 === 0 && beYear % 100 !== 0) || beYear % 400 === 0;
  };

  // get Max day of Khmer month
  const getMaxDayOfKhmerMonth = (beMonth: number, beYear: number): number => {
    if (beMonth === lunarMonths["ជេស្ឋ"] && isKhmerLunarLeapDay(beYear)) {
      return 30;
    }
    if (
      beMonth === lunarMonths["បឋមាសាឍ"] ||
      beMonth === lunarMonths["ទុតិយាសាឍ"]
    ) {
      return 30;
    }
    return beMonth % 2 === 0 ? 29 : 30;
  };

  // Get number of day in Khmer year
  const getNumDayOfKhmerYear = (beYear: number): number => {
    if (isKhmerLeapMonth(beYear)) {
      return 384;
    } else if (isKhmerLunarLeapDay(beYear)) {
      return 355;
    } else {
      return 354;
    }
  };

  // Get number of day in Gregorian year
  const getNumDayOfGregorianYear = (adYear: number): number => {
    if (isGregorianLeapYear(adYear)) {
      return 366;
    }
    return 365;
  };

  // Buddhist Era
  // ថ្ងៃឆ្លងឆ្នាំ គឺ ១ រោច ខែពិសាខ
  // @ref http://news.sabay.com.kh/article/1039620
  // @summary: ឯកឧត្តម សេង សុមុនី អ្នកនាំពាក្យ​ក្រ​សួង​ធម្មការ និង​សាសនា​ឲ្យ​Sabay ដឹង​ថា​នៅ​ប្រ​ទេស​កម្ពុជា​ការ​ឆ្លង​ចូល​ពុទ្ធសករាជថ្មី​គឺ​កំណត់​យក​នៅ​ថ្ងៃព្រះ​ពុទ្ធយាងចូល​និព្វាន ពោល​គឺ​នៅ​ថ្ងៃ​១រោច ខែពិសាខ។
  // @param dayjs

  const getBEYear = (date: dayjs.Dayjs): number => {
    if (date.diff(getVisakBochea(date.year())) > 0) {
      return date.year() + 544;
    } else {
      return date.year() + 543;
    }
  };

  const getMaybeBEYear = (date: dayjs.Dayjs): number => {
    if (date.month() <= solarMonths["មេសា"]) {
      return date.year() + 544;
    } else {
      return date.year() + 543;
    }
  };

  // Next month of Khmer month
  const nextMonthOf = (khmerMonth: number, beYear: number): number => {
    switch (khmerMonth) {
      case lunarMonths["មិគសិរ"]:
        return lunarMonths["បុស្ស"];
      case lunarMonths["បុស្ស"]:
        return lunarMonths["មាឃ"];
      case lunarMonths["មាឃ"]:
        return lunarMonths["ផល្គុន"];
      case lunarMonths["ផល្គុន"]:
        return lunarMonths["ចេត្រ"];
      case lunarMonths["ចេត្រ"]:
        return lunarMonths["ពិសាខ"];
      case lunarMonths["ពិសាខ"]:
        return lunarMonths["ជេស្ឋ"];
      case lunarMonths["ជេស្ឋ"]: {
        if (isKhmerLeapMonth(beYear)) {
          return lunarMonths["បឋមាសាឍ"];
        } else {
          return lunarMonths["អាសាឍ"];
        }
      }
      case lunarMonths["អាសាឍ"]:
        return lunarMonths["ស្រាពណ៍"];
      case lunarMonths["ស្រាពណ៍"]:
        return lunarMonths["ភទ្របទ"];
      case lunarMonths["ភទ្របទ"]:
        return lunarMonths["អស្សុជ"];
      case lunarMonths["អស្សុជ"]:
        return lunarMonths["កក្ដិក"];
      case lunarMonths["កក្ដិក"]:
        return lunarMonths["មិគសិរ"];
      case lunarMonths["បឋមាសាឍ"]:
        return lunarMonths["ទុតិយាសាឍ"];
      case lunarMonths["ទុតិយាសាឍ"]:
        return lunarMonths["ស្រាពណ៍"];
      default:
        throw Error("Plugin is facing wrong calculation (Invalid month)");
    }
  };

  // calculate date from dayjs to Khmer date
  const getLunarDate = (date: dayjs.Dayjs): any => {
    // Add badMutable plugin to change original date
    dayjs.extend(badMutable);

    // Epoch Date: January 1, 1900
    let epochDayjs = dayjs("1900-01-01");
    let khmerMonth = lunarMonths["បុស្ស"];
    let khmerDay = 0; // 0 - 29 ១កើត ... ១៥កើត ១រោច ...១៤រោច (១៥រោច)

    let differentFromEpoch = date.diff(epochDayjs);

    // fixed dayjs not change original date

    // Find nearest year epoch
    if (differentFromEpoch > 0) {
      while (
        dayjs.duration(date.diff(epochDayjs), "milliseconds").asDays() >
        getNumDayOfKhmerYear(getMaybeBEYear(epochDayjs.clone().add(1, "year")))
      ) {
        epochDayjs.add(
          getNumDayOfKhmerYear(
            getMaybeBEYear(epochDayjs.clone().add(1, "year")),
          ),
          "day",
        );
      }
    } else {
      do {
        epochDayjs.subtract(
          getNumDayOfKhmerYear(
            getMaybeBEYear(epochDayjs.clone().subtract(1, "year")),
          ),
          "day",
        );
      } while (
        dayjs.duration(date.diff(epochDayjs), "milliseconds").asDays() > 0
      );
    }

    // Move epoch month
    while (
      dayjs.duration(date.diff(epochDayjs), "milliseconds").asDays() >
      getMaxDayOfKhmerMonth(khmerMonth, getMaybeBEYear(epochDayjs))
    ) {
      epochDayjs.add(
        getMaxDayOfKhmerMonth(khmerMonth, getMaybeBEYear(epochDayjs)),
        "day",
      );
      khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochDayjs));
    }

    khmerDay += floor(
      dayjs.duration(date.diff(epochDayjs), "milliseconds").asDays(),
    );

    // fix result display 15 រោច ខែ ជេស្ឋ នៅថ្ងៃ ១ កើតខែបឋមាសាធ
    // ករណី ខែជេស្ឋមានតែ ២៩ ថ្ងៃ តែលទ្ធផលបង្ហាញ ១៥រោច ខែជេស្ឋ
    const totalDaysOfTheMonth = getMaxDayOfKhmerMonth(
      khmerMonth,
      getMaybeBEYear(date),
    );
    if (totalDaysOfTheMonth <= khmerDay) {
      khmerDay = khmerDay % totalDaysOfTheMonth;
      khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochDayjs));
    }

    epochDayjs.add(
      dayjs.duration(date.diff(epochDayjs), "milliseconds").asDays(),
      "day",
    );

    return {
      day: khmerDay,
      month: khmerMonth,
      epochMoved: epochDayjs,
    };
  };

  // រកថ្ងៃវិសាខបូជា
  // ថ្ងៃដាច់ឆ្នាំពុទ្ធសករាជ
  const getVisakBochea = (
    gregorianYear: number,
  ): string | number | dayjs.Dayjs | Date | null | undefined | any => {
    const date = dayjs(`${gregorianYear}-01-01`);
    for (var i = 0; i < 365; i++) {
      const lunarDate = getLunarDate(date);
      if (lunarDate.month === lunarMonths["ពិសាខ"] && lunarDate.day === 14) {
        return date;
      }
      date.add(1, "day");
    }
  };

  // Khmer date format handler
  const formatKhmerDate = (
    date: dayjs.Dayjs,
    month: number,
    dayjs: dayjs.Dayjs,
    format: string,
  ): string => {
    if (format === null || format === undefined) {
      // Default date format
      const dayOfWeek = dayjs.day();
      const moonDay = getLunarDate(date);
      const beYear = getBEYear(dayjs);
      // const animalYear = getAnimalYear(dayjs);
      // const eraYear = getJolakSakarajYear(dayjs) % 10;
      return `ថ្ងៃ${constant.kh.weekdays[dayOfWeek]} ${moonDay.count}${
        constant.kh.moonStatus[moonDay.moonStatus]
      } ខែ${constant.kh.lunarMonths[month]} ឆ្នាំ${
        constant.kh.animalYear[animalYear]
      } ${constant.kh.eraYear[eraYear]} ពុទ្ធសករាជ ${beYear}`;
    } else if (typeof format === "string") {
    }
  };

  // format date to Khmer date
  const format = (format: string): string => {
    const date = globalDate.clone();
    const lunarDate = getLunarDate(date);
  };
}
dayjskh(dayjs());
// console.log(dayjskh(dayjs("2021-01-01")).getLunarDate(dayjs("2021-01-01")));
// console.log(dayjs().month());
