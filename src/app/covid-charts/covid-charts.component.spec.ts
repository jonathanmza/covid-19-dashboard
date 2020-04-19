import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidChartsComponent } from './covid-charts.component';
import { ChartsModule } from 'ng2-charts';

describe('CovidChartsComponent', () => {
  let component: CovidChartsComponent;
  let fixture: ComponentFixture<CovidChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChartsModule],
      declarations: [CovidChartsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
