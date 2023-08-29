import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import learnSak from "./lerngSak";
import { lunar } from "./khmercal";

function datesOfKhmerNewYear(startDate: Dayjs, numberOfNewYearDays: number) {
  let dates = [];
  for (let i = 0; i < numberOfNewYearDays; i++) {
    dates.push(startDate.clone().add(i, "day"));
  }
  return dates.map((date, index) => {
    // find first day
    let dayName = "Moha Sangkranta"; // មហាសង្រ្កាន្ត
    if (index === 0) {
      dayName = "Moha Sangkranta"; // មហាសង្រ្កាន្ត
    } // last day
    else if (index === numberOfNewYearDays - 1) {
      dayName = "Veareak Laeung Sak"; // ថ្ងៃឡើងស័ក
    } else {
      dayName = "Veareak Vanabat"; // វារៈវ័នបត
    }
    return {
      date,
      dayName,
    };
  });
}

// get khmer new year day
function getKhmerNewYear(gregorianYear: number): {
  date: Dayjs;
  days: number;
  dates: { date: Dayjs; dayName: string }[];
} {
  // ពីគ្រិស្ដសករាជ ទៅ ចុល្លសករាជ
  let jsYear = gregorianYear + 544 - 1182;
  let info = learnSak(jsYear);
  let numberOfNewYearDay;
  if (info.newYearsDaySotins[0].angsar === 0) {
    numberOfNewYearDay = 4;
  } else {
    numberOfNewYearDay = 3;
  }
  let epochLerngSak = dayjs(`${gregorianYear}-04-17`, "YYYY-MM-DD");
  const { day, month } = lunar(epochLerngSak);
  let diffFromEpoch =
    (month.index - 4) * 30 +
    (day - 1) -
    ((info.lunarDateLerngSak.month - 4) * 30 + info.lunarDateLerngSak.day);

  let result = epochLerngSak.subtract(
    diffFromEpoch + numberOfNewYearDay - 1,
    "day",
  );

  result = dayjs(
    `${result.format("YYYY-MM-DD")}T${info.timeOfNewYear.hour}:${
      info.timeOfNewYear.minute
    }`,
  );

  return {
    date: result,
    days: numberOfNewYearDay,
    dates: datesOfKhmerNewYear(result, numberOfNewYearDay),
  };
}

// find animal year
function getAnimalYear(date: dayjs.Dayjs): number {
  const year = date.year();
  const KhmerNewYear = getKhmerNewYear(year).date;
  if (date.diff(KhmerNewYear) < 0) {
    return (year + 543 + 4) % 12;
  } else {
    return (year + 544 + 4) % 12;
  }
}

// Jolak Sakaraj
function getJolakSakarajYear(date: dayjs.Dayjs) {
  const year = date.year();
  const KhmerNewYear = getKhmerNewYear(year).date;
  if (date.diff(KhmerNewYear) < 0) {
    return year + 543 - 1182;
  } else {
    return year + 544 - 1182;
  }
}

export const khmerNewYear = {
  getKhmerNewYear,
  getAnimalYear,
  getJolakSakarajYear,
};
