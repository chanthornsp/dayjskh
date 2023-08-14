// Khmer Chhankitek Calendar
// Ref.: https://khmer-calendar.tovnah.com/calendar/toc.php

import { constant } from "./constsant";
import learnSak from "./lerngSak";
import dayjs from "dayjs";
import km from "dayjs/locale/km";
import updateLocale from "dayjs/plugin/updateLocale";
import duration from "dayjs/plugin/duration";
import badMutable from "dayjs/plugin/badMutable";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.extend(duration);
dayjs.extend(badMutable);
dayjs.locale(km);

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

export default function dayjskh(date?: dayjs.Dayjs | string) {
  // check if date is valid
  const globalDate = dayjs(date); // if date is undefined, it will return current date
  if (!globalDate.isValid()) {
    throw new Error("Invalid Date");
  }

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
    if (date.month() + 1 <= solarMonths["មេសា"] + 1) {
      return date.year() + 543;
    } else {
      return date.year() + 544;
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
  const getLunarDate = (targetDate: dayjs.Dayjs): any => {
    // Add badMutable plugin to change original date
    // Epoch Date: January 1, 1900
    const epochDayjs = dayjs("1900-01-01");
    const epochDayjsClone = epochDayjs.clone();
    let khmerMonth = lunarMonths["បុស្ស"];
    let khmerDay = 0; // 0 - 29 ១កើត ... ១៥កើត ១រោច ...១៤រោច (១៥រោច)
    const differentFromEpoch = targetDate.diff(epochDayjs);
    // Find nearest year epoch
    if (differentFromEpoch > 0) {
      while (
        dayjs
          .duration(targetDate.diff(epochDayjs), "milliseconds")
          .clone()
          .asDays() > // ok
        getNumDayOfKhmerYear(getMaybeBEYear(epochDayjsClone.add(1, "year")))
      ) {
        epochDayjs.add(
          getNumDayOfKhmerYear(
            getMaybeBEYear(epochDayjsClone.clone().add(1, "year")),
          ),
          "day",
        );
      }
    } else {
      do {
        epochDayjs.subtract(
          getNumDayOfKhmerYear(getMaybeBEYear(epochDayjs)),
          "day",
        );
      } while (
        dayjs
          .duration(epochDayjs.diff(targetDate), "milliseconds")
          .clone()
          .asDays() > 0
      );
    }
    // Move epoch month
    while (
      dayjs.duration(targetDate.diff(epochDayjs), "milliseconds").asDays() >
      getMaxDayOfKhmerMonth(khmerMonth, getMaybeBEYear(epochDayjs))
    ) {
      epochDayjs.add(
        getMaxDayOfKhmerMonth(khmerMonth, getMaybeBEYear(epochDayjs)),
        "day",
      );
      khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochDayjs));
    }

    khmerDay += floor(
      dayjs.duration(targetDate.diff(epochDayjs), "milliseconds").asDays(),
    );

    // fix result display 15 រោច ខែ ជេស្ឋ នៅថ្ងៃ ១ កើតខែបឋមាសាធ
    // ករណី ខែជេស្ឋមានតែ ២៩ ថ្ងៃ តែលទ្ធផលបង្ហាញ ១៥រោច ខែជេស្ឋ
    const totalDaysOfTheMonth = getMaxDayOfKhmerMonth(
      khmerMonth,
      getMaybeBEYear(targetDate),
    );
    if (totalDaysOfTheMonth <= khmerDay) {
      khmerDay = khmerDay % totalDaysOfTheMonth;
      khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochDayjs));
    }

    epochDayjs.add(
      dayjs.duration(targetDate.diff(epochDayjs), "milliseconds").asDays(),
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

  // get khmer new year day
  const getKhmerNewYear = (gregorianYear: number): dayjs.Dayjs => {
    // ពីគ្រិស្ដសករាជ ទៅ ចុល្លសករាជ
    let jsYear = gregorianYear + 544 - 1182;
    let info = learnSak(jsYear);
    let numberOfNewYearDay;
    if (info.newYearsDaySotins[0].angsar === 0) {
      numberOfNewYearDay = 4;
    } else {
      numberOfNewYearDay = 3;
    }
    let epochLerngSak = dayjs(
      `${gregorianYear}-04-17 ${info.timeOfNewYear.hour}:${info.timeOfNewYear.minute}`,
    );
    let KhEpoch = getLunarDate(epochLerngSak);
    let diffFromEpoch =
      (KhEpoch.month - 4) * 30 +
      KhEpoch.day -
      ((info.lunarDateLerngSak.month - 4) * 30 + info.lunarDateLerngSak.day);
    const result = epochLerngSak.subtract(
      diffFromEpoch + numberOfNewYearDay,
      "day",
    );

    return result;
  };
  // find animal year
  const getAnimalYear = (date: dayjs.Dayjs): number => {
    const year = date.year();
    const KhmerNewYear = getKhmerNewYear(year);
    if (date.diff(KhmerNewYear) < 0) {
      return (year + 543 + 4) % 12;
    } else {
      return (year + 544 + 4) % 12;
    }
  };

  // Jolak Sakaraj
  const getJolakSakarajYear = (date: dayjs.Dayjs) => {
    const year = date.year();
    const KhmerNewYear = getKhmerNewYear(year);
    if (date.diff(KhmerNewYear) < 0) {
      return year + 543 - 1182;
    } else {
      return year + 544 - 1182;
    }
  };

  const getKhmerLunarDayName = (
    day: number,
  ): { count: number; moonStatus: number } => {
    return {
      count: (day % 15) + 1,
      moonStatus:
        day > 14 ? constant.moonStatus["រោច"] : constant.moonStatus["កើត"],
    };
  };

  // Khmer date format handler
  const formatKhmerDate = (
    day: number,
    month: number,
    dayjs: dayjs.Dayjs,
    format: string,
  ): string => {
    if (format === null || format === undefined || format === "") {
      // Default date format
      const dayOfWeek = dayjs.day();
      const moonDay = getKhmerLunarDayName(day);
      const beYear = getBEYear(dayjs);
      const animalYear = getAnimalYear(dayjs);
      const eraYear = getJolakSakarajYear(dayjs) % 10;
      return constant.kh.postformat(
        `ថ្ងៃ${constant.kh.weekdays[dayOfWeek]} ${moonDay.count}${
          constant.kh.moonStatus[moonDay.moonStatus]
        } ខែ${constant.kh.lunarMonths[month]} ឆ្នាំ${
          constant.kh.animalYear[animalYear]
        } ${constant.kh.eraYear[eraYear]} ពុទ្ធសករាជ ${beYear}`,
      );
    } else if (typeof format === "string") {
      const formatRules = {
        W: () => {
          return constant.kh.weekdays[dayjs.day()];
        },
        w: () => {
          return constant.kh.weekdaysShort[dayjs.day()];
        },
        d: () => {
          const moonDay = getKhmerLunarDayName(day);
          return moonDay.count;
        },
        D: () => {
          const moonDay = getKhmerLunarDayName(day);
          return ("" + moonDay.count).length === 1
            ? `០${moonDay.count}`
            : moonDay.count;
        },
        N: () => {
          const moonDay = getKhmerLunarDayName(day);
          return constant.kh.moonStatus[moonDay.moonStatus];
        },
        n: () => {
          const moonDay = getKhmerLunarDayName(day);
          return constant.kh.moonStatusShort[moonDay.moonStatus];
        },
        o: () => {
          return constant.kh.moonDays[day];
        },
        m: () => {
          return constant.kh.lunarMonths[month];
        },
        M: () => {
          return constant.kh.months[dayjs.month()];
        },
        a: () => {
          return constant.kh.animalYear[getAnimalYear(dayjs)];
        },
        e: () => {
          return constant.kh.eraYear[getJolakSakarajYear(dayjs) % 10];
        },
        b: () => {
          return getBEYear(dayjs);
        },
        c: () => {
          return dayjs.year();
        },
        j: () => {
          return getJolakSakarajYear(dayjs);
        },
      };
      return constant.kh.postformat(
        format.replace(
          new RegExp(Object.keys(formatRules).join("|"), "g"),
          (m) => formatRules[m](),
        ),
      );
    }
  };

  // format date to Khmer date
  const format = (format?: string): string => {
    const date = globalDate.clone();
    const lunarDate = getLunarDate(date);
    const result = formatKhmerDate(
      lunarDate.day,
      lunarDate.month,
      date,
      format,
    );
    return result;
  };

  return {
    format,
    date: globalDate,
  };
}
