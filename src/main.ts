import dayjskh from "./dayjskh";
export default function toKhDate(o, c, d) {
  const proto = c.prototype;
  // add return toKhDate() to dayjs object and parse format for Khmer date
  proto.toKhDate = function (format) {
    return format ? dayjskh(this).format(format) : dayjskh(this);
  };
  proto.khNewYear = function (year) {
    return dayjskh(this).khmerNewYearDate(year ?? this.year());
  };
}
