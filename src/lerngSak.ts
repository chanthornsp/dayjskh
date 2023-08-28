import dayjs from "dayjs";
import { constant } from "./constant";

// calculate Khmer New Year
// based on: https://www.dahlina.com/education/khmer_new_year_time.html?fbclid=IwAR0Eq6US-F0LfplMjKzmiRn7rvPgi31i74Wpv4mNhU034mzdyj-3hYrCA8w
export default function learnSak(jsYear: number = dayjs().year()) {
  if (arguments.length === 0) {
    jsYear = dayjs().year();
  } else {
    jsYear = arguments[0];
  }

  const getInfo = (
    jsYear: number,
  ): {
    harkun: number;
    kromathopol: number;
    avaman: number;
    bodithey: number;
  } => {
    let h = 292207 * jsYear + 373;
    let harkun = Math.floor(h / 800) + 1;
    let kromathopol = 800 - (h % 800);

    let a = 11 * harkun + 650;
    let avaman = a % 692;
    let bodithey = (harkun + Math.floor(a / 692)) % 30;
    return {
      harkun,
      kromathopol,
      avaman,
      bodithey,
    };
  };

  const getHas366Days = (jsYear: number): boolean => {
    const { kromathopol } = getInfo(jsYear);
    return kromathopol <= 207;
  };

  const getIsAdhikameas = (jsYear: number): boolean => {
    const { bodithey: infoOfYear } = getInfo(jsYear);
    const { bodithey: infoOfNextYear } = getInfo(jsYear + 1);
    return (
      !(infoOfYear === 25 && infoOfNextYear === 5) &&
      (infoOfYear > 24 ||
        infoOfNextYear < 6 ||
        (infoOfYear === 24 && infoOfNextYear === 6))
    );
  };

  const getIsChantreathimeas = (jsYear: number): boolean => {
    const { avaman: infoOfYear } = getInfo(jsYear);
    const { avaman: infoOfNextYear } = getInfo(jsYear + 1);
    const { avaman: infoOfPrevYear } = getInfo(jsYear - 1);
    const has366Days = getHas366Days(jsYear);
    return (
      (has366Days && infoOfYear < 127) ||
      (!(infoOfYear === 137 && infoOfNextYear === 0) &&
        ((!has366Days && infoOfYear < 138) ||
          (infoOfPrevYear === 137 && infoOfYear === 0)))
    );
  };

  const has366Days = getHas366Days(jsYear);
  const isAdhikameas = getIsAdhikameas(jsYear);
  const isChantreathimeas = getIsChantreathimeas(jsYear);

  const jesthHas30 = (): boolean => {
    const isAthikameas = isAdhikameas;
    let tmp = isChantreathimeas;
    if (isAthikameas && isChantreathimeas) {
      tmp = false;
    }
    if (
      !isChantreathimeas &&
      getIsAdhikameas(jsYear - 1) &&
      getIsChantreathimeas(jsYear - 1)
    ) {
      tmp = true;
    }
    return tmp;
  };

  const dayLerngSak = (getInfo(jsYear).harkun - 2) % 7;

  const lunarDateLerngSak = (): {
    day: number;
    month: number;
  } => {
    let { bodithey: bodithey } = getInfo(jsYear);
    if (getIsAdhikameas(jsYear - 1) && getIsChantreathimeas(jsYear - 1)) {
      bodithey = (bodithey + 1) % 30;
    }
    return {
      day: bodithey >= 6 ? bodithey - 1 : bodithey,
      month:
        bodithey >= 6
          ? constant.lunarMonths["ចេត្រ"]
          : constant.lunarMonths["ពិសាខ"],
    };
  };

  const getSunInfo = (sotin: number) => {
    const infoOfPreviousYear = getInfo(jsYear - 1);

    const sunAverageAsLibda = (): number => {
      let r2 = 800 * sotin + infoOfPreviousYear.kromathopol;
      let reasey = Math.floor(r2 / 24350); // រាសី
      let r3 = r2 % 24350;
      let angsar = Math.floor(r3 / 811); // អង្សា
      let r4 = r3 % 811;
      let l1 = Math.floor(r4 / 14);
      let libda = l1 - 3; // លិប្ដា
      return 30 * 60 * reasey + 60 * angsar + libda;
    };

    const leftOver = (): number => {
      let s1 = 30 * 60 * 2 + 60 * 20;
      let leftOver = sunAverageAsLibda() - s1; // មធ្យមព្រះអាទិត្យ - R2.A20.L0
      if (sunAverageAsLibda() < s1) {
        // បើតូចជាង ខ្ចី ១២ រាសី
        leftOver += 30 * 60 * 12;
      }
      return leftOver;
    };

    const kaen = (): number => {
      return Math.floor(leftOver() / (30 * 60));
    };

    const lastLeftOver = (): {
      reasey: number;
      angsar: number;
      libda: number;
    } => {
      let rs = -1;
      if ([0, 1, 2].includes(kaen())) {
        rs = kaen();
      } else if ([3, 4, 5].includes(kaen())) {
        rs = 30 * 60 * 6 - leftOver(); // R6.A0.L0 - leftover
      } else if ([6, 7, 8].includes(kaen())) {
        rs = leftOver() - 30 * 60 * 6; // leftover - R6.A0.L0
      } else if ([9, 10, 11].includes(kaen())) {
        rs = 30 * 60 * 11 + 60 * 29 + 60 - leftOver(); // R11.A29.L60 - leftover
      }
      return {
        reasey: Math.floor(rs / (30 * 60)),
        angsar: Math.floor((rs % (30 * 60)) / 60),
        libda: rs % 60,
      };
    };

    const khan = (): number => {
      if (lastLeftOver().angsar >= 15) {
        return 2 * lastLeftOver().reasey + 1;
      } else {
        return 2 * lastLeftOver().reasey;
      }
    };

    const pouichalip = (): number => {
      if (lastLeftOver().angsar >= 15) {
        return 60 * (lastLeftOver().angsar - 15) + lastLeftOver().libda;
      } else {
        return 60 * lastLeftOver().angsar + lastLeftOver().libda;
      }
    };

    const phol = (): {
      reasey: number;
      angsar: number;
      libda: number;
    } => {
      const chhayaSun = (
        khan: number,
      ): {
        multiplicity: number;
        chhaya: number;
      } => {
        let multiplicities = [35, 32, 27, 22, 13, 5];
        let chhayas = [0, 35, 67, 94, 116, 129];
        switch (khan) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            return {
              multiplicity: multiplicities[khan],
              chhaya: chhayas[khan],
            };
          default:
            return {
              multiplicity: 0,
              chhaya: 134,
            };
        }
      };

      let val = chhayaSun(khan());
      let q = Math.floor((pouichalip() * val.multiplicity) / 900);
      return {
        reasey: 0,
        angsar: Math.floor((q + val.chhaya) / 60),
        libda: (q + val.chhaya) % 60,
      };
    };

    const sunInaugurationAsLibda = (): number => {
      let pholAsLibda =
        30 * 60 * phol().reasey + 60 * phol().angsar + phol().libda;
      if (kaen() <= 5) {
        return sunAverageAsLibda() - pholAsLibda;
      } else {
        return sunAverageAsLibda() + pholAsLibda;
      }
    };

    return {
      sunAverageAsLibda,
      khan,
      pouichalip,
      phol,
      sunInaugurationAsLibda,
    };
  };

  const newYearsDaySotins = (): {
    sotin: number;
    reasey: number;
    angsar: number;
    libda: number;
  }[] => {
    let sotins = getHas366Days(jsYear - 1)
      ? [363, 364, 365, 366]
      : [362, 363, 364, 365]; // សុទិន
    return sotins.map((sotin) => {
      let sunInfo = getSunInfo(sotin);
      return {
        sotin: sotin,
        reasey: Math.floor(sunInfo.sunInaugurationAsLibda() / (30 * 60)),
        angsar: Math.floor((sunInfo.sunInaugurationAsLibda() % (30 * 60)) / 60), // អង្សាស្មើសូន្យ គីជាថ្ងៃចូលឆ្នាំ, មួយ ឬ ពីរ ថ្ងៃបន្ទាប់ជាថ្ងៃវ័នបត ហើយ ថ្ងៃចុងក្រោយគីឡើងស័ក
        libda: sunInfo.sunInaugurationAsLibda() % 60,
      };
    });
  };

  const timeOfNewYear = (): {
    hour: number;
    minute: number;
  } => {
    let sotinNewYear = newYearsDaySotins().filter(function (sotin) {
      return sotin.angsar === 0;
    });
    if (sotinNewYear.length > 0) {
      let libda = sotinNewYear[0].libda; // ២៤ ម៉ោង មាន ៦០លិប្ដា
      let minutes = 24 * 60 - libda * 24;
      return {
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      };
    } else {
      throw Error(
        "Plugin is facing wrong calculation on new years hour. No sotin with angsar = 0",
      );
    }
  };

  const info = getInfo(jsYear);

  return {
    jsYear: jsYear,
    harkun: info.harkun,
    kromathopol: info.kromathopol,
    avaman: info.avaman,
    bodithey: info.bodithey,
    has366Days: has366Days,
    isAdhikameas: isAdhikameas,
    isChantreathimeas: isChantreathimeas,
    jesthHas30: jesthHas30(),
    dayLerngSak: dayLerngSak,
    lunarDateLerngSak: lunarDateLerngSak(),
    newYearsDaySotins: newYearsDaySotins(),
    timeOfNewYear: timeOfNewYear(),
  };
}
