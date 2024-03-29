import { Component, OnInit } from '@angular/core';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import Stramen from 'ol/source/Stamen';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { CovidClientService } from '@app/service/covid-client/covid-client.service';
import { CovidCountrySummaryData } from '@app/model/covid-country-summary-data.model';
import Point from 'ol/geom/Point';
import { CovidCountryHistorical } from '@app/model/covid-country-historical.model';
import { tap } from 'rxjs/operators';
import { SymbolType } from 'ol/style/literal';

@Component({
  selector: 'app-covid-overview',
  templateUrl: './covid-overview.component.html',
  styleUrls: ['./covid-overview.component.scss'],
})
export class CovidOverviewComponent implements OnInit {
  public map: Map;
  public selectedCountryHistoricalData: CovidCountryHistorical;
  private readonly covidCasesVectorSource = new VectorSource();
  private readonly CIRCLE_DEFAULT_RADIUS = 500;
  private readonly centerCoordinates = [-10, 30];
  private readonly data: CovidCountrySummaryData[] = [];

  // Useful to see very small circles
  private readonly ADDITIONAL_CIRCLE_RADIUS = 5;

  private readonly CIRCLE_RGB_COLOR = [238, 34, 0];
  private readonly CIRCLE_OPACITY = 0.6;
  private readonly CIRCLE_SIZE_FORMULA = [
    '+',
    ['/', ['*', this.CIRCLE_DEFAULT_RADIUS, ['get', 'cases']], ['/', ['get', 'totalCases'], ['zoom']]],
    this.ADDITIONAL_CIRCLE_RADIUS,
  ];

  constructor(private covidService: CovidClientService) {}

  ngOnInit(): void {
    this.loadHistoricalDataByCountry('france');
    this.buildCovidMap()
      .then((fulfilledCovidMap) => {
        this.map = fulfilledCovidMap;
        this.listenToCircleClicked();
      })
      .then(() => {
        this.covidService
          .getAllCovidCountriesData()
          .toPromise()
          .then((coviDataFromAPI) => {
            this.data.push(...coviDataFromAPI);
            this.buildCovidCasesFeatures(coviDataFromAPI);
          });
      });
  }

  /**
   * Build the COVID-19 map
   */
  private buildCovidMap(): Promise<Map> {
    return Promise.resolve(
      new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new Stramen({
              layer: 'toner',
            }),
          }),
          new WebGLPointsLayer({
            source: this.covidCasesVectorSource,
            style: {
              symbol: {
                symbolType: SymbolType.CIRCLE,
                size: this.CIRCLE_SIZE_FORMULA,
                color: this.CIRCLE_RGB_COLOR,
                rotateWithView: false,
                opacity: this.CIRCLE_OPACITY,
              },
            },
          }),
        ],
        view: new View({
          center: fromLonLat(this.centerCoordinates),
          zoom: 3,
        }),
      })
    );
  }

  /**
   * Build the COVID-19 map's features
   * @param map the Open Layer map
   * @param covidData the covid data
   */
  private buildCovidCasesFeatures(covidData: CovidCountrySummaryData[]) {
    covidData.forEach((covidDataItem) => {
      this.covidCasesVectorSource.addFeature(
        new Feature({
          geometry: new Point(fromLonLat([covidDataItem.countryInfo.long, covidDataItem.countryInfo.lat])),
          cases: covidDataItem.cases,
          totalCases: this.totalCases,
          country: covidDataItem.country,
        })
      );
    });
  }

  /**
   * Load all covid historical data
   * @param countryName the name of the country
   */
  private loadHistoricalDataByCountry(countryName: string) {
    this.covidService
      .getAllCovidCountryHistoricData(countryName)
      .pipe(tap((defaultCountryData) => (this.selectedCountryHistoricalData = defaultCountryData)))
      .subscribe();
  }

  /**
   * Listen to circle's click event
   */
  private listenToCircleClicked() {
    this.map.on('click', (e) => {
      this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) =>
        this.loadHistoricalDataByCountry(feature.get('country'))
      );
    });
  }

  get totalCases(): number {
    return this.data
      .map((cData) => cData.cases)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  get totalDeaths(): number {
    return this.data
      .map((cData) => cData.deaths)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  get totalDeathsToday(): number {
    return this.data
      .map((cData) => cData.todayDeaths)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  get totalRecovered(): number {
    return this.data
      .map((cData) => cData.recovered)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }
}
