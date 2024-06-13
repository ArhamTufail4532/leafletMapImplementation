import { Injectable } from '@angular/core';
import * as AllMechineData from '../assets/MultipleMachineData.json';
@Injectable({
  providedIn: 'root'
})
export class MultipleMachineDataService {

  constructor() { }
  
  getMultipleMechineData(){
    return AllMechineData;
  }
}
