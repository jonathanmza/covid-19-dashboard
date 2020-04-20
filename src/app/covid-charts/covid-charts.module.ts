import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidChartsComponent } from './covid-charts.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [CovidChartsComponent],
  imports: [CommonModule, FlexLayoutModule, ChartsModule],
  exports: [CovidChartsComponent],
})
export class CovidChartsModule {}
