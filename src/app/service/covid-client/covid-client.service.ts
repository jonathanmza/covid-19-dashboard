import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CovidCountrySummaryData } from '@app/model/covid-country-summary-data.model';

@Injectable({
  providedIn: 'root',
})
export class CovidClientService {
  private readonly COVID_URL = 'https://corona.lmao.ninja/countries';

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieve all the covid information for all countries
   */
  public getAllCovidCountriesData(): Observable<CovidCountrySummaryData[]> {
    return this.httpClient.get<CovidCountrySummaryData[]>(this.COVID_URL);
  }
}
