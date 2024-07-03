import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData():void{
    this.showClusterControl = false;
    this.legends.isLifting = true;
    this.legends.isNoLifting = true;
    this.legends.isRoad = true;
    this.legends.isUnloading = true;
  }
}
