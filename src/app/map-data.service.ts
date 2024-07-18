import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private legendDataUrl = 'https://r-connect.myropa.top/api/Map/GetMapViewLegendData';
  private apiUrl = 'https://r-connect.myropa.top/api/Map/GetMachineSingleViewData';
  private singleMachineMultipleDateUrl = 'https://r-connect.myropa.top/api/Map/GetMachineSingleViewData';
  private singleMachineMapViewData = 'https://r-connect.myropa.top/api/Map/GetMachineSingleMapViewData';
  private MultipleMachineWithMultipleDates = 'https://r-connect.myropa.top/api/Map/GetMapViewMapData';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization':'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxRDQzRDE1N0I0MUE4OTJERjE1QkUxOThBNjRGMDdFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3MjEyODgwMTcsImV4cCI6MTcyMTMyNzYxNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IlItQ29ubmVjdDp0b3AiLCJzdWIiOiI2ZGE3YTljNC1kMzM4LTQ1NGUtYjU4MC1jNDYxMzJmMjlmMTAiLCJhdXRoX3RpbWUiOjE3MjAxODM5OTksImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkUzUlFOTVJXUktKTk9RQ00zWVpHMkJaUjZBSFBMU0xTIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJlbWFpbCI6InNhZGFxYXQuaHVzc2FpbkBiZWRtLmRlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJyb2xlX2Rldl91c2VyIiwicm9sZV9tYWNoaW5lX2FkbWluIiwicm9sZV9kcml2ZXIiLCJyb2xlX2Z1ZWxfc3VwcGxpZXIiLCJyb2xlX2RldmVsb3BwZXIiLCJyb2xlX3NhbGVzX3N0YWZmIiwicm9sZV9zZXJ2aWNlX3N0YWZmIiwicm9sZV9wb3J0YWxfbXlyb3BhIiwicm9sZV9hY2NvdW50X293bmVyIiwicm9sZV9tYXRlcmlhbHNfcmVxdWlyZW1lbnRzX3BsYW5uZXIiLCJyb2xlX2FjY291bnRfbWFuYWdlciIsInJvbGVfYmFzZV9zZXJ2aWNlX2NlbnRlcl9tYW5hZ2VyIiwicm9sZV9wb3J0YWxfcmNvbm5lY3QiLCJyb2xlX2Jhc2VfYXV0aG9yaXplZF9tYWludGVuYW5jZV90ZWNobmljaWFuIiwicm9sZV90cmFuc2xhdG9yIiwicm9sZV9hdXRob3JpemVkX21haW50ZW5hbmNlX3RlY2huaWNpYW4iLCJyb2xlX2Jhc2Vfc3RhZmYiLCJyb2xlX2Jhc2Vfcm9wYV9zdGFmZiIsInJvbGVfYmFzZV9hY2NvdW50X293bmVyIl0sInNpZCI6IkI4MjNEMTc2QTBDRUQ2MTY3MDhBQzA0NTJGQ0RBREU2IiwiaWF0IjoxNzIxMjg4MDE3LCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIl0sImFtciI6WyJwd2QiXX0.A15QAGBjW6PRQjGK0sMCheX9hTKtXZTkkCU3F3Csru7zZ6E6el1ZwgROSh7lrv9xqSLhUxLorb-FOQfIAu8MFRoE5HELsDW7zUOP6qWu7TZD4iayCpFYa9Dnx-QO4NPo8_Uy6Psj2PeRN78KeoaeqR3m2wR-vt9mR8kVjEKm8t_2zJxB0ft_tSYrjZ9auXUVsVofgwcgVSRKvT9x-A2f7DRhdUEfcSm4M8QgnL-DV62Ztfs7973Wi4aQlsqhUu1CrVoICrgmPI5d9yvGlbXFiPKgp7V7PIZCVkf_34Ja-_00wPVuB7GWaugMF9GJDB_-lY0KdkjFtPOl32hAjT0bRA',
    'User-Id': '6da7a9c4-d338-454e-b580-c46132f29f10' 
  });
  constructor(private http: HttpClient) { }

  getMachineLastPosition(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, { headers: this.headers });
  }
  getSingleMachineDataWithMultipleDates(payload: any): Observable<any>{
    return this.http.post<any>(this.singleMachineMultipleDateUrl, payload, { headers: this.headers });
  }
  getSingleMachineMapViewDataForExtendView(payload:any){
    return this.http.post<any>(this.singleMachineMapViewData,payload,{ headers: this.headers });
  }
  getMultipleMachineWithMultipleDates(payload:any){
    return this.http.post<any>(this.MultipleMachineWithMultipleDates,payload,{ headers: this.headers });
  }
  getImageForMultipleMachine(imageUrl: string): Observable<any> {
    return this.http.get<any>('https://myropa.top/documents/' + imageUrl, { headers: this.headers, responseType: 'blob' as 'json' });
  }
  getLegendData(payload:any){
    return this.http.post<any>(this.legendDataUrl,payload,{ headers: this.headers });
  }
}
