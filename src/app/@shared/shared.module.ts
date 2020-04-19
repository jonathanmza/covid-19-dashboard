import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [],
  exports: [],
})
export class SharedModule {}
