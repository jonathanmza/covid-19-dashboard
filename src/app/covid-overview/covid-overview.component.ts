import { Component, OnInit } from '@angular/core';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import Stramen from 'ol/source/Stamen';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Circle from 'ol/geom/Circle';
import GeometryLayout from 'ol/geom/GeometryLayout';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import { CovidClientService } from '@app/service/covid-client/covid-client.service';
import { Observable, of } from 'rxjs';

interface CovidCountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

interface CovidCountrySummaryData {
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

@Component({
  selector: 'app-covid-overview',
  templateUrl: './covid-overview.component.html',
  styleUrls: ['./covid-overview.component.scss'],
})
export class CovidOverviewComponent implements OnInit {
  public map: Map;
  private readonly covidCasesVectorSource = new VectorSource();
  private readonly CIRCLE_DEFAULT_RADIUS = 35000000;
  private readonly centerCoordinates = [30, 20];
  private readonly data: CovidCountrySummaryData[] = [];

  private readonly ADDITIONAL_CIRCLE_RADIUS = 50000;

  constructor(private covidService: CovidClientService) {}

  ngOnInit(): void {
    this.buildCovidMap()
      .then((fulfilledCovidMap) => {
        this.map = fulfilledCovidMap;

        // Listening to zoom changes in order to redraw the circles
        this.map.getView().on('change:resolution', () => {
          this.covidCasesVectorSource.clear();
          this.buildCovidCasesFeatures(this.data);
        });
      })
      .then(() => {
        this.covidService
          .getAllCovidCountriesData()
          .toPromise()
          .then((coviDataFromAPI) => {
            console.table(coviDataFromAPI);
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
          new VectorLayer({
            source: this.covidCasesVectorSource,
            style: this.buildStyle([238, 34, 0], 0.6),
          }),
        ],
        view: new View({
          center: fromLonLat(this.centerCoordinates),
          zoom: 0,
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
    const totalCases = this.calculateTotalCovidCases(covidData);

    covidData.forEach((covidDataItem) => {
      this.covidCasesVectorSource.addFeature(
        new Feature({
          geometry: this.drawCovidCaseNumberCircle(covidDataItem, totalCases),
        })
      );
    });
  }

  /**
   * Calculate the total number of cases
   * @param covidData the covid data
   */
  private calculateTotalCovidCases(covidData: CovidCountrySummaryData[]): number {
    return covidData
      .map((cData) => cData.cases)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  /**
   * Draw a circle. The radius depends on the number of country's cases relative
   * to the total cases and the the zoom level
   * @param covidDataItem a covid data item
   * @param totalCases the total number of cases
   */
  private drawCovidCaseNumberCircle(covidDataItem: CovidCountrySummaryData, totalCases: number): Circle {
    return new Circle(
      fromLonLat([covidDataItem.countryInfo.long, covidDataItem.countryInfo.lat]),
      (this.CIRCLE_DEFAULT_RADIUS * covidDataItem.cases) / totalCases / this.map.getView().getZoom() +
        this.ADDITIONAL_CIRCLE_RADIUS,
      GeometryLayout.XY
    );
  }

  /**
   * Build an open layer style object
   * @param rgbColor the RGB color as an array
   * @param opacity the opacity between 0 and 1
   */
  private buildStyle(rgbColor: number[], opacity: number): Style {
    return new Style({
      fill: new Fill({
        color: [...rgbColor, opacity],
      }),
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
