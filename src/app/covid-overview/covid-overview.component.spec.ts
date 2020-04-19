import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

jest.mock('ol/source/Vector');

import { CovidOverviewComponent } from './covid-overview.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CovidClientService } from '@app/service/covid-client/covid-client.service';
import { CovidChartsModule } from '@app/covid-charts/covid-charts.module';
import { ChartsModule } from 'ng2-charts';

describe('CovidOverviewComponent', () => {
  let component: CovidOverviewComponent;
  let fixture: ComponentFixture<CovidOverviewComponent>;

  beforeEach(async(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CovidChartsModule, ChartsModule],
      declarations: [CovidOverviewComponent],
      providers: [CovidClientService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the covid-19 API for all countries and historical data for france on initialisation', async () => {
    // Arrange
    const httpMockAPI = getTestBed().inject(HttpTestingController);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    httpMockAPI.expectOne('https://corona.lmao.ninja/v2/countries');
    httpMockAPI.expectOne('https://corona.lmao.ninja/v2/historical/france');
    httpMockAPI.verify();
  });
});
