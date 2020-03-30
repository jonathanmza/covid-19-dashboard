import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CovidClientService {
  private readonly COVID_URL = 'https://corona.lmao.ninja/countries';

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieve all the covid information for all countries
   */
  public getAllCovidCountriesData(): Observable<any> {
    return this.httpClient.get(this.COVID_URL);
  }
}
