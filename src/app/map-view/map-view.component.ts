import { Component } from '@angular/core';
import { MechineDataServiceService } from '../mechine-data-service.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent { //selecting multiple Dates and Showing Multiple Machines

  _machineData:any;

  constructor(private _singleMechineData: MechineDataServiceService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
    console.log(this._machineData);
  }
}
