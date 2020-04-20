interface Timeline {
  cases?: { [date: string]: number };
  deaths?: { [date: string]: number };
  recovered?: { [date: string]: number };
}

export interface CovidCountryHistorical {
  country?: string;
  province?: string;
  timeline?: Timeline;
}
