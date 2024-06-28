import { Injectable } from '@angular/core';
import * as SingleMechineDatawithMultipleDates from '../assets/singleMechineData.json';
import * as MultipleMachineData from '../assets/MultipleMachineData.json';
import * as MultipleMachineWithMultipleDates from '../assets/multipleMachineDateValue.json';

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
}
