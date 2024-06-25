import { Component } from '@angular/core';

@Component({
  selector: 'app-leaflet-dashboard',
  templateUrl: './leaflet-dashboard.component.html',
  styleUrls: ['./leaflet-dashboard.component.scss']
})
export class LeafletDashboardComponent {

  view: string = 'singleMachine';

  setView(view: string) {
    this.view = view;
  }
}
