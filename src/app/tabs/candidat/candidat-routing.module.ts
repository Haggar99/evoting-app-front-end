import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatPage } from './candidat.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatPageRoutingModule {}
