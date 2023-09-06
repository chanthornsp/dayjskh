import dayjskh from "./dayjskh";
import type { PluginFunc } from "dayjs";
import type plugin from "../types";
import { constant } from "./constant";
import { lunar } from "./khmercal";
import { utils } from "./utils";
import { KhmercalType } from "../types/lunar";

const toKhmerDate: PluginFunc<plugin.toKhmerDate> = (o, c) => {
  const proto = c.prototype;
  proto.toKhmerDate = function (format?: string) {
    const date = constant.kh.preparse(this.format());
    const lunarDate = lunar(date) as KhmercalType;
    return utils.formatKhmerDate(lunarDate, this, format);
  };
  proto.khNewYear = function () {
    return dayjskh().khmerNewYearDate(this.year());
  };
};
export default toKhmerDate;
