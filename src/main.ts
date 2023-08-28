import dayjskh from "./dayjskh";
import type { PluginFunc } from "dayjs";
import type plugin from "../types";
import { constant } from "./constant";

const toKhmerDate: PluginFunc<plugin.toKhmerDate> = (o, c, d) => {
  const proto = c.prototype;
  proto.toKhmerDate = function (format?: string) {
    const date = constant.kh.preparse(this.format());
    return dayjskh(date).format(format);
  };
  proto.khNewYear = function () {
    return dayjskh(this.year()).khmerNewYearDate(this.year());
  };
};

export default toKhmerDate;
