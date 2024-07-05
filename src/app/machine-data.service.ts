import { Injectable } from '@angular/core';
import * as SingleMechineDatawithMultipleDates from '../assets/singleMechineData.json';
import * as MultipleMachineData from '../assets/MultipleMachineData.json';
import * as MultipleMachineWithMultipleDates from '../assets/multipleMachineDateValue.json';
import * as MultipleMachineMapData from '../assets/multipleMachineMapData.json';
import { HttpClient } from  '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MachineDataService {
  private url = 'https://r-connect.myropa.top/api/Map/GetMachineSingleViewData';

   headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getSingleMechineWithSingleDate(){
    return SingleMechineDatawithMultipleDates;
  }
  getAllMechineForClusters(){
    return MultipleMachineData;
  }
  getSingleMachineWithMultipleDates(){
    return MultipleMachineWithMultipleDates;
  }

  postData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make POST request with data as body
    return this.http.post<any>(this.url, data, { headers });
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
}
