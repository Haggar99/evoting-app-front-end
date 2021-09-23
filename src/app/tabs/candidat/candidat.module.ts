import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatPageRoutingModule } from './candidat-routing.module';

import { CandidatPage } from './candidat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatPageRoutingModule
  ],
  declarations: [CandidatPage]
})
export class CandidatPageModule {}
