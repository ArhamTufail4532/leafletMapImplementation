import { Injectable } from '@angular/core';
import * as SingleMechineDatawithMultipleDates from '../assets/singleMechineData.json';
import * as MultipleMachineData from '../assets/MultipleMachineData.json';
import * as MultipleMachineWithMultipleDates from '../assets/multipleMachineDateValue.json';
import * as MultipleMachineMapData from '../assets/multipleMachineMapData.json';

@Injectable({
  providedIn: 'root'
})
export class MachineDataService {

  constructor() { }

  getSingleMechineWithSingleDate(){
    return SingleMechineDatawithMultipleDates;
  }
  getAllMechineForClusters(){
    return MultipleMachineData;
  }
  getSingleMachineWithMultipleDates(){
    return MultipleMachineWithMultipleDates;
  }

  getMultipleMachineMapdata(){
    return MultipleMachineMapData;
  }

  private index: number = -1;

  setIndex(value: number): void {
    this.index = value;
  }

  getIndex(): number {
    return this.index;
  }

  private date : any;

  setDate(value: any):void {
    this.date = value;
  }
  getDate(): any{
    return this.date;
  }
}
