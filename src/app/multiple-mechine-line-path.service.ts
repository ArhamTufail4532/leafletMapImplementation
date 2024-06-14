import { Injectable } from '@angular/core';
import * as AllMachineLinePath from '../assets/multipleMachineDateValue.json';
@Injectable({
  providedIn: 'root'
})
export class MultipleMechineLinePathService {

  constructor() { }

  getAllMechineLinePath(){
    return AllMachineLinePath;
  }
}
