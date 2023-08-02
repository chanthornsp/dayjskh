const lunarMonths: { [key: string]: number } = {};
"មិគសិរ_បុស្ស_មាឃ_ផល្គុន_ចេត្រ_ពិសាខ_ជេស្ឋ_អាសាឍ_ស្រាពណ៍_ភទ្របទ_អស្សុជ_កក្ដិក_បឋមាសាឍ_ទុតិយាសាឍ"
  .split("_")
  .forEach((month, index) => (lunarMonths[month] = index));

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

export const constant = {
  lunarMonths,
  solarMonths,
  animalYears,
  eraYears,
  moonStatus,
  khNewYear,
};
