import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeafletDashboardComponent } from '../app/leaflet-dashboard/leaflet-dashboard.component';
import {SingleMachineViewComponent} from '../app/single-machine-view/single-machine-view.component';
import {MapViewComponent } from '../app/map-view/map-view.component';
import {SingleMachineViewExtendComponent} from '../app/single-machine-view-extend/single-machine-view-extend.component'; 

const routes: Routes = [
  {path: "",component:SingleMachineViewComponent},
  {path:"singleMachineView",component: SingleMachineViewComponent},
  {path:'SingleMachineViewExtendComponent',component: SingleMachineViewExtendComponent},
  {path:'MapViewComponent',component: MapViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
