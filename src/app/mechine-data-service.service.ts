import { Injectable } from '@angular/core';
import * as MechineData from '../assets/singleMechineData.json';

@Injectable({
  providedIn: 'root'
})
export class MechineDataServiceService {

  constructor() { }

  getMechineData(){
    return MechineData;
  }
}
