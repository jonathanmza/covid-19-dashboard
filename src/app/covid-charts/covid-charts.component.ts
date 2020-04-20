import { Component, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, Input, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { CovidCountryHistorical } from '@app/model/covid-country-historical.model';

@Component({
  selector: 'app-covid-charts',
  templateUrl: './covid-charts.component.html',
  styleUrls: ['./covid-charts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CovidChartsComponent implements OnInit, OnChanges {
  @Input() public historicalData: CovidCountryHistorical = null;
  @ViewChild('caseChart', { read: BaseChartDirective }) caseChart: BaseChartDirective;
  @ViewChild('deathChart', { read: BaseChartDirective }) deathChart: BaseChartDirective;
  @ViewChild('recoveredChart', { read: BaseChartDirective }) recoveredChart: BaseChartDirective;
  public lineCasesChartData: ChartDataSets[] = [{ data: [], label: 'Historique du nombre total de cas' }];
  public lineCasesChartLabels: Label[] = [];

  public lineDeathsChartData: ChartDataSets[] = [{ data: [], label: 'Historique du nombre total de morts' }];
  public lineDeathsChartLabels: Label[] = [];

  public lineRecoveredChartData: ChartDataSets[] = [{ data: [], label: 'Historique du nombre total de guérisons' }];
  public lineRecoveredChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 18,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 15,
          },
        },
      ],
    },
    legend: {
      labels: {
        fontSize: 14,
        fontStyle: 'bold',
      },
    },

    events: [],
  };
  public redLineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.6)',
    },
  ];
  public greenLineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(43,255,0,0.7)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins: any = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.historicalData?.currentValue) {
      const historicalData: CovidCountryHistorical = changes.historicalData.currentValue;
      this.updateDataForCasesHistoricalChart(historicalData);
      this.updateDataForDeathsHistoricalChart(historicalData);
      this.updateDataForRecoveredHistoricalChart(historicalData);
    }
  }

  /**
   * Update the cases line chart
   * @param historicalData the historical data for the selected country
   */
  private updateDataForCasesHistoricalChart(historicalData: CovidCountryHistorical) {
    const casesDates = Object.keys(historicalData.timeline.cases);
    const casesValues = Object.values(historicalData.timeline.cases);

    this.lineCasesChartData[0].data.splice(0, this.lineCasesChartData[0].data.length, ...casesValues);
    this.lineCasesChartLabels.splice(0, this.lineCasesChartLabels.length, ...casesDates);
    this.lineCasesChartData[0].label = `Historique du nombre total de cas (${historicalData.country})`;
    this.caseChart.chart.update();
  }

  /**
   * Update the death line chart
   * @param historicalData the historical data for the selected country
   */
  private updateDataForDeathsHistoricalChart(historicalData: CovidCountryHistorical) {
    const deathDates = Object.keys(historicalData.timeline.deaths);
    const deathValues = Object.values(historicalData.timeline.deaths);

    this.lineDeathsChartData[0].data.splice(0, this.lineCasesChartData[0].data.length, ...deathValues);
    this.lineDeathsChartLabels.splice(0, this.lineCasesChartLabels.length, ...deathDates);
    this.lineDeathsChartData[0].label = `Historique du nombre total de morts (${historicalData.country})`;
    this.deathChart.chart.update();
  }

  /**
   * Update the recovered line chart
   * @param historicalData the historical data for the selected country
   */
  private updateDataForRecoveredHistoricalChart(historicalData: CovidCountryHistorical) {
    const recoveredDates = Object.keys(historicalData.timeline.recovered);
    const recoveredValues = Object.values(historicalData.timeline.recovered);

    this.lineRecoveredChartData[0].data.splice(0, this.lineCasesChartData[0].data.length, ...recoveredValues);
    this.lineRecoveredChartLabels.splice(0, this.lineCasesChartLabels.length, ...recoveredDates);
    this.lineRecoveredChartData[0].label = `Historique du nombre total de guérisons (${historicalData.country})`;
    this.recoveredChart.chart.update();
  }
}
