import { TestBed, getTestBed } from '@angular/core/testing';

import { CovidClientService } from './covid-client.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CovidCountrySummaryData } from '@app/model/covid-country-summary-data.model';
import { tap } from 'rxjs/operators';

describe('CovidClientService', () => {
  let service: CovidClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CovidClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET HTTP request to retrieve COVID-19 data', () => {
    // Arrange
    const httpMockAPI = getTestBed().inject(HttpTestingController);
    const resultCovidDataList: CovidCountrySummaryData[] = [];
    const fakeCovidDataList = [
      {
        cases: 707,
      },
    ] as CovidCountrySummaryData[];

    // Act
    service
      .getAllCovidCountriesData()
      .pipe(tap((data) => resultCovidDataList.push(...data)))
      .subscribe();

    // Assert
    httpMockAPI.expectOne('https://corona.lmao.ninja/countries').flush(fakeCovidDataList);
    httpMockAPI.verify();
    expect(resultCovidDataList.length).toBe(1);
    expect(resultCovidDataList).toMatchObject([{ cases: 707 }]);
  });
});
