const lunarMonths = {};
"មិគសិរ_បុស្ស_មាឃ_ផល្គុន_ចេត្រ_ពិសាខ_ជេស្ឋ_អាសាឍ_ស្រាពណ៍_ភទ្របទ_អស្សុជ_កក្ដិក_បឋមាសាឍ_ទុតិយាសាឍ"
  .split("_")
  .forEach((month, index) => {
    lunarMonths[month] = index;
  });

const solarMonths: { [key: string]: number } = {};
"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ"
  .split("_")
  .forEach((month, index) => (solarMonths[month] = index));

const animalYears: { [key: string]: number } = {};
"ជូត_ឆ្លូវ_ខាល_ថោះ_រោង_ម្សាញ់_មមីរ_មមែ_វក_រកា_ច_កុរ"
  .split("_")
  .forEach((year, index) => (animalYears[year] = index));

const eraYears: { [key: string]: number } = {};
"សំរឹទ្ធិស័ក_ឯកស័ក_ទោស័ក_ត្រីស័ក_ចត្វាស័ក_បញ្ចស័ក_ឆស័ក_សប្តស័ក_អដ្ឋស័ក_នព្វស័ក"
  .split("_")
  .forEach((year, index) => (eraYears[year] = index));

const moonStatus: { [key: string]: number } = {};
"កើត_រោច".split("_").forEach((status, index) => (moonStatus[status] = index));

const khNewYear: { [key: string]: string } = {
  "1879": "12-04-1879 11:36",
  "1897": "13-04-1897 02:00",
  "2011": "14-04-2011 13:12",
  "2012": "14-04-2012 19:11",
  "2013": "14-04-2013 02:12",
  "2014": "14-04-2014 08:07",
  "2015": "14-04-2015 14:02",
};

const kh = () => {
  let symbolMap = {
      1: "១",
      2: "២",
      3: "៣",
      4: "៤",
      5: "៥",
      6: "៦",
      7: "៧",
      8: "៨",
      9: "៩",
      0: "០",
    },
    numberMap = {
      "១": 1,
      "២": 2,
      "៣": 3,
      "៤": 4,
      "៥": 5,
      "៦": 6,
      "៧": 7,
      "៨": 8,
      "៩": 9,
      "០": 0,
    };

  return {
    months:
      "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
        "_",
      ),
    monthsShort:
      "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
        "_",
      ),
    moonDays:
      "᧡_᧢_᧣_᧤_᧥_᧦_᧧_᧨_᧩_᧪_᧫_᧬_᧭_᧮_᧯_᧱_᧲_᧳_᧴_᧵_᧶_᧷_᧸_᧹_᧺_᧻_᧼_᧽_᧾_᧿".split("_"),
    moonStatus: "កើត_រោច".split("_"),
    moonStatusShort: "ក_រ".split("_"),
    weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
    weekdaysShort: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
    weekdaysMin: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
    lunarMonths:
      "មិគសិរ_បុស្ស_មាឃ_ផល្គុន_ចេត្រ_ពិសាខ_ជេស្ឋ_អាសាឍ_ស្រាពណ៍_ភទ្របទ_អស្សុជ_កក្ដិក_បឋមាសាឍ_ទុតិយាសាឍ".split(
        "_",
      ),
    animalYear: "ជូត_ឆ្លូវ_ខាល_ថោះ_រោង_ម្សាញ់_មមីរ_មមែ_វក_រកា_ច_កុរ".split("_"),
    eraYear:
      "សំរឹទ្ធិស័ក_ឯកស័ក_ទោស័ក_ត្រីស័ក_ចត្វាស័ក_បញ្ចស័ក_ឆស័ក_សប្តស័ក_អដ្ឋស័ក_នព្វស័ក".split(
        "_",
      ),
    preparse: function (number: any) {
      return number.toString().replace(/[០១២៣៤៥៦៧៨៩]/g, (m) => numberMap[m]);
    },
    postformat: function (number: any) {
      return number.toString().replace(/\d/g, (m) => symbolMap[m]);
    },
  };
};

export const constant = {
  lunarMonths,
  solarMonths,
  animalYears,
  eraYears,
  moonStatus,
  khNewYear,
  kh: kh(),
};
