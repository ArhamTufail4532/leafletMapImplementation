import { Component } from '@angular/core';
import { MechineDataServiceService } from '../mechine-data-service.service';

@Component({
  selector: 'app-single-machine-view-extend',
  templateUrl: './single-machine-view-extend.component.html',
  styleUrls: ['./single-machine-view-extend.component.scss']
})
export class SingleMachineViewExtendComponent { //multiple dates selecting implementation on a single Machine
  _machineData : any;

  constructor(private _singleMechineData: MechineDataServiceService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
    console.log(this._machineData);
  }
}
