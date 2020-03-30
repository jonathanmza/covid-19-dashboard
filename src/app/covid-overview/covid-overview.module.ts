import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidOverviewRoutingModule } from './covid-overview-routing.module';
import { CovidOverviewComponent } from './covid-overview.component';
import { MaterialModule } from '@app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [CovidOverviewComponent],
  imports: [CommonModule, FlexLayoutModule, MaterialModule, CovidOverviewRoutingModule],
})
export class CovidOverviewModule {}
