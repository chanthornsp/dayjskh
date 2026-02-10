import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import learnSak from "./lerngSak";
import { constant } from "./constant";

// Ensure customParseFormat plugin is loaded
dayjs.extend(customParseFormat);

function datesOfKhmerNewYear(startDate: Dayjs, numberOfNewYearDays: number) {
  const dates = [];
  for (let i = 0; i < numberOfNewYearDays; i++) {
    dates.push(startDate.clone().add(i, "day"));
  }
  return dates.map((date, index) => {
    let dayName = "Moha Sangkranta"; // មហាសង្រ្កាន្ត
    if (index === 0) {
      dayName = "Moha Sangkranta"; // មហាសង្រ្កាន្ត
    } else if (index === numberOfNewYearDays - 1) {
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

/**
 * Get Khmer New Year information for a given Gregorian year
 * @param gregorianYear - The Gregorian year (e.g., 2024)
 * @returns Object containing date, number of days, and array of celebration dates
 */
function getKhmerNewYear(gregorianYear: number): {
  date: Dayjs;
  days: number;
  dates: { date: Dayjs; dayName: string }[];
} {
  // Calculate JS year (Jolak Sakaraj)
  const jsYear = gregorianYear + 544 - 1182;
  const info = learnSak(jsYear);

  // Check for days override first, otherwise use astronomical calculation
  // Astronomical: 4 days if angsar[0] === 0 (leap cycle), otherwise 3 days
  const daysOverride = constant.khNewYearDays[gregorianYear.toString()];
  const numberOfNewYearDay =
    daysOverride !== undefined
      ? daysOverride
      : info.newYearsDaySotins[0].angsar === 0
        ? 4
        : 3;

  // Check if constant date exists for this year
  const constantDate = constant.khNewYear[gregorianYear.toString()];
  if (constantDate) {
    const result = dayjs(constantDate, "DD-MM-YYYY HH:mm");
    if (result.isValid()) {
      return {
        date: result,
        days: numberOfNewYearDay,
        dates: datesOfKhmerNewYear(result, numberOfNewYearDay),
      };
    }
  }

  // Fall back to calculation if no constant
  // Algorithm: Find which sotin has angsar === 0 (sun enters Aries)
  // The index (0-3) directly maps to: April (13 + index)
  // Khmer New Year is ALWAYS April 13 or April 14

  const angsar0Index = info.newYearsDaySotins.findIndex((s) => s.angsar === 0);

  if (angsar0Index === -1) {
    throw new Error(
      `Could not calculate Khmer New Year for ${gregorianYear}: no sotin with angsar === 0`,
    );
  }

  // New Year day = April 13 + index (typically 0 or 1, giving April 13 or 14)
  const newYearDay = 13 + angsar0Index;

  // Create result date with time from astronomical calculation
  const result = dayjs(
    `${gregorianYear}-04-${String(newYearDay).padStart(2, "0")}T${String(info.timeOfNewYear.hour).padStart(2, "0")}:${String(info.timeOfNewYear.minute).padStart(2, "0")}`,
  );

  return {
    date: result,
    days: numberOfNewYearDay,
    dates: datesOfKhmerNewYear(result, numberOfNewYearDay),
  };
}

/**
 * Get the animal year (zodiac) for a given date
 * @param date - A dayjs date object
 * @returns The animal year index (0-11)
 */
function getAnimalYear(date: dayjs.Dayjs): number {
  const year = date.year();
  const KhmerNewYear = getKhmerNewYear(year).date;
  if (date.diff(KhmerNewYear) < 0) {
    return (year + 543 + 4) % 12;
  } else {
    return (year + 544 + 4) % 12;
  }
}

/**
 * Get the Jolak Sakaraj year for a given date
 * @param date - A dayjs date object
 * @returns The Jolak Sakaraj year
 */
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
