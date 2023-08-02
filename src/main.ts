// Khmer Chhankitek Calendar
// Ref.: https://khmer-calendar.tovnah.com/calendar/toc.php

import { constant } from "./constsant";
import learnSak from "./lerngSak";
import dayjs, { Dayjs } from "dayjs";
import localeData from "dayjs/plugin/localeData";
import km from "dayjs/locale/km";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.locale(km);

dayjs.updateLocale("km", {
  // check time unit
  meridiem: function (hour, minute, isLowercase) {
    if (hour >= 12) {
      return isLowercase ? "ល្ងាច" : "ល្ងាច";
    } else {
      return isLowercase ? "ព្រឹក" : "ព្រឹក";
    }
  },
});

const { lunarMonths, solarMonths, moonStatus, khNewYear } = constant;

const dayjsKh = (Dayjs: any) => {
  console.log(Dayjs);
};

export default dayjsKh;
