import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '@app/shell/shell.service';

const routes: Routes = [Shell.childRoutes([{ path: '', redirectTo: '/covid-overview', pathMatch: 'full' }])];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CovidOverviewRoutingModule {}
