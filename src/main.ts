import dayjskh from "./dayjskh";
import type { PluginFunc } from "dayjs";
import type plugin from "../types";
import { constant } from "./constant";

const toKhDate: PluginFunc<plugin.toKhDate> = (o, c, d) => {
  const proto = c.prototype;
  proto.toKhDate = function (format?: string) {
    const date = constant.kh.preparse(this.format());
    return dayjskh(date).format(format);
  };
  proto.khNewYear = function () {
    return dayjskh(this.year()).khmerNewYearDate(this.year());
  };
};

export default toKhDate;
