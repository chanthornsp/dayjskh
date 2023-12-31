# Khmer Lunar Date plugin for [Day.js](https://day.js.org/)

Convert Date to Khmer Lunar Date [see more...](https://web.archive.org/web/20190714153528/http://www.cam-cc.org/calendar/).

## Installation

```bash
npm install dayjs
npm install dayjskh
```

## Usage

```js
import dayjs from "dayjs";
import toKhmerDate from "dayjskh";

dayjs.extend(toKhmerDate);

const date = dayjs();
console.log(date.toKhmerDate(format?)); // ថ្ងៃច័ន្ទ ១២កើត ខែស្រាពណ៍ ឆ្នាំថោះ បញ្ចស័ក ពុទ្ធសករាជ ២៥៦៧
// find khmer new year dateTime
console.log(date.khNewYear());
// type
// {
//     date: Dayjs;
//     days: number;
//     dates: {
//         date: Dayjs;
//         dayName: string;
//     }[]
// }
```

## TODO

-   [ ❌ ] Clean up code

# Author

-   This library is Ported from [momentkh](https://github.com/ThyrithSor/momentkh) by [Thyrith Sor](https://github.com/ThyrithSor) in to [Day.js Plugin](https://day.js.org/).
-   Combined Source Code from [khmercal](https://github.com/seanghay/khmercal) by [Seanghay](https://github.com/seanghay)
