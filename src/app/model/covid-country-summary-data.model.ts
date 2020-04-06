import { CovidCountryInfo } from './covid-country-info.model';

export interface CovidCountrySummaryData {
  country: string;
  countryInfo: CovidCountryInfo;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  updated: number;
}
