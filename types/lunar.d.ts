export interface KhmercalType {
  day: number;
  period: {
    day: number;
    moon: string;
  };
  // sequence: number;
  // sak: string;
  zodiac: string;
  years: Years;
  length: number;
  monthLength: number;
  month: Month;
  months: string[];
}

export interface Month {
  name: string;
  index: number;
}

export interface Years {
  JE: number;
  CE: number;
  BE: number;
}
