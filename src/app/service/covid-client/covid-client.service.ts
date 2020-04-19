import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CovidCountrySummaryData } from '@app/model/covid-country-summary-data.model';
import { CovidCountryHistorical } from '@app/model/covid-country-historical.model';

@Injectable({
  providedIn: 'root',
})
export class CovidClientService {
  private readonly COVID_URL = 'https://corona.lmao.ninja/v2';

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieve all the covid information for all countries
   */
  public getAllCovidCountriesData(): Observable<CovidCountrySummaryData[]> {
    return this.httpClient.get<CovidCountrySummaryData[]>(`${this.COVID_URL}/countries`);
  }

  /**
   * Retrieve all the covid historic information for a country
   * @param countryName the country for which we want the historical data
   */
  public getAllCovidCountryHistoricData(countryName: string): Observable<CovidCountryHistorical> {
    return this.httpClient.get<CovidCountryHistorical>(`${this.COVID_URL}/historical/${countryName}`);
  }
}
