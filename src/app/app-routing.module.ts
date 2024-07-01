import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingleMachineViewExtendComponent} from '../app/single-machine-view-extend/single-machine-view-extend.component'; 

const routes: Routes = [
  {path:'attributes',component: SingleMachineViewExtendComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
