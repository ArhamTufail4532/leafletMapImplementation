import { Component } from '@angular/core';
import { Lagends } from '../Models/Lagends.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent { //selecting multiple Dates and Showing Multiple Machines

  _machineData:any;
  legends: Lagends = new Lagends();

  constructor() { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this.legends.isUnloading = false;
  }
}
