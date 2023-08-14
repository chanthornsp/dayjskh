import dayjskh from "./dayjskh";
export default function toKhDate(o, c, d) {
  const proto = c.prototype;
  // add return toKhDate() to dayjs object and parse format for Khmer date
  proto.toKhDate = function (format) {
    const khmerDate = dayjskh(this);
    return khmerDate.format(format);
  };
}
