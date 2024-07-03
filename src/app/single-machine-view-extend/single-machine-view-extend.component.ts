import { Component } from '@angular/core';
import { Lagends } from '../Models/Lagends.model';
import { MachineDataService } from '../machine-data.service';

@Component({
  selector: 'app-single-machine-view-extend',
  templateUrl: './single-machine-view-extend.component.html',
  styleUrls: ['./single-machine-view-extend.component.scss']
})
export class SingleMachineViewExtendComponent { //multiple dates selecting implementation on a single Machine
  _machineData : any;
  legends: Lagends = new Lagends();
  dateRangePicker : any;
  constructor(private _singleMachineData:MachineDataService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this.legends.isUnloading = false;
    this.dateRangePicker = false;
    console.log("index data is "+this._singleMachineData.getIndex());
  }
}
