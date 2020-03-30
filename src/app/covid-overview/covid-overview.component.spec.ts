import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidOverviewComponent } from './covid-overview.component';

describe('CovidOverviewComponent', () => {
  let component: CovidOverviewComponent;
  let fixture: ComponentFixture<CovidOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CovidOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
