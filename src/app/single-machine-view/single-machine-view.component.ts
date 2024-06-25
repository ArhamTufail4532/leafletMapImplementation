import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MechineDataServiceService } from '../mechine-data-service.service';
import * as L from 'leaflet';
import { Lagends } from '../Models/Lagends.model';
@Component({
  selector: 'app-single-machine-view',
  templateUrl: './single-machine-view.component.html',
  styleUrls: ['./single-machine-view.component.scss']
})
export class SingleMachineViewComponent { //single date selecting implementation on a single Machine

  _machineData:any;
  showFullscreenControl?:boolean;
  showClusterControl:any;
  showZoomControl?:boolean;
  showScaleControl?:boolean;
  legends: Lagends = new Lagends();

  /* @Input() value? : string;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  sendNotification(){
    this.notify.emit("notification from child component!");
  } */

  constructor(private _singleMechineData: MechineDataServiceService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
    console.log(this._machineData);
    this.showClusterControl = false;
  }
}
