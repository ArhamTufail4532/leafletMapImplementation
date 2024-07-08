import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private apiUrl = 'https://r-connect.myropa.top/api/Map/GetMachineSingleViewData';
  private singleMachineMultipleDateUrl = 'https://r-connect.myropa.top/api/Map/GetMachineSingleViewData';

  constructor(private http: HttpClient) { }

  getMachineLastPosition(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkUxOERBQjUxQTMyMTY2ODRFNTk1OTJGRDdDRjY3NkVFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3MjA0MTY4NzksImV4cCI6MTcyMDQ1NjQ3OSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IlItQ29ubmVjdDp0b3AiLCJzdWIiOiI2ZGE3YTljNC1kMzM4LTQ1NGUtYjU4MC1jNDYxMzJmMjlmMTAiLCJhdXRoX3RpbWUiOjE3MjAxODM5OTksImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkUzUlFOTVJXUktKTk9RQ00zWVpHMkJaUjZBSFBMU0xTIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJlbWFpbCI6InNhZGFxYXQuaHVzc2FpbkBiZWRtLmRlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJyb2xlX2Rldl91c2VyIiwicm9sZV9tYWNoaW5lX2FkbWluIiwicm9sZV9kcml2ZXIiLCJyb2xlX2Z1ZWxfc3VwcGxpZXIiLCJyb2xlX2RldmVsb3BwZXIiLCJyb2xlX3NhbGVzX3N0YWZmIiwicm9sZV9zZXJ2aWNlX3N0YWZmIiwicm9sZV9wb3J0YWxfbXlyb3BhIiwicm9sZV9hY2NvdW50X293bmVyIiwicm9sZV9tYXRlcmlhbHNfcmVxdWlyZW1lbnRzX3BsYW5uZXIiLCJyb2xlX2FjY291bnRfbWFuYWdlciIsInJvbGVfYmFzZV9zZXJ2aWNlX2NlbnRlcl9tYW5hZ2VyIiwicm9sZV9wb3J0YWxfcmNvbm5lY3QiLCJyb2xlX2Jhc2VfYXV0aG9yaXplZF9tYWludGVuYW5jZV90ZWNobmljaWFuIiwicm9sZV90cmFuc2xhdG9yIiwicm9sZV9hdXRob3JpemVkX21haW50ZW5hbmNlX3RlY2huaWNpYW4iLCJyb2xlX2Jhc2Vfc3RhZmYiLCJyb2xlX2Jhc2Vfcm9wYV9zdGFmZiIsInJvbGVfYmFzZV9hY2NvdW50X293bmVyIl0sInNpZCI6IkI4MjNEMTc2QTBDRUQ2MTY3MDhBQzA0NTJGQ0RBREU2IiwiaWF0IjoxNzIwNDE2ODc5LCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIl0sImFtciI6WyJwd2QiXX0.juyRI_IdBc0DDFWSdy0dIbqbtz7wxGiS2iZbz41vodXLU0D3iweJsJq7LuLAyFp0N2nG5vY870K_N42F9MTuz_DngKjUfW3-IE2DMXLQ4EoZwYa631GFiuadeHXBBtInE9xkcqQL3Z3d_uMMrYrkrpA8BPq45IyBNeeU-8543AoZmoLFKWoDGRKxniRNJuWbRdvqxGigrIXEuCU1CVK2JnzcRfMB6OzbNjJLPfOATbyOZCM0C___G23mgNQTDQEu4TOlUFcpvtfBuIMlt9n5BMY-iwerhnetcSCkkq5wtvOUE1c1M5Jguf29PezXd38RnWTCyC1kt4zEp2U_aN6b8A',
      'User-Id': '6da7a9c4-d338-454e-b580-c46132f29f10' 
    });

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
  getSingleMachineDataWithMultipleDates(payload: any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkUxOERBQjUxQTMyMTY2ODRFNTk1OTJGRDdDRjY3NkVFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3MjA0MTY4NzksImV4cCI6MTcyMDQ1NjQ3OSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS5teXJvcGEudG9wL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IlItQ29ubmVjdDp0b3AiLCJzdWIiOiI2ZGE3YTljNC1kMzM4LTQ1NGUtYjU4MC1jNDYxMzJmMjlmMTAiLCJhdXRoX3RpbWUiOjE3MjAxODM5OTksImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkUzUlFOTVJXUktKTk9RQ00zWVpHMkJaUjZBSFBMU0xTIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJuYW1lIjoic2FkYXFhdC5odXNzYWluQGJlZG0uZGUiLCJlbWFpbCI6InNhZGFxYXQuaHVzc2FpbkBiZWRtLmRlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJyb2xlX2Rldl91c2VyIiwicm9sZV9tYWNoaW5lX2FkbWluIiwicm9sZV9kcml2ZXIiLCJyb2xlX2Z1ZWxfc3VwcGxpZXIiLCJyb2xlX2RldmVsb3BwZXIiLCJyb2xlX3NhbGVzX3N0YWZmIiwicm9sZV9zZXJ2aWNlX3N0YWZmIiwicm9sZV9wb3J0YWxfbXlyb3BhIiwicm9sZV9hY2NvdW50X293bmVyIiwicm9sZV9tYXRlcmlhbHNfcmVxdWlyZW1lbnRzX3BsYW5uZXIiLCJyb2xlX2FjY291bnRfbWFuYWdlciIsInJvbGVfYmFzZV9zZXJ2aWNlX2NlbnRlcl9tYW5hZ2VyIiwicm9sZV9wb3J0YWxfcmNvbm5lY3QiLCJyb2xlX2Jhc2VfYXV0aG9yaXplZF9tYWludGVuYW5jZV90ZWNobmljaWFuIiwicm9sZV90cmFuc2xhdG9yIiwicm9sZV9hdXRob3JpemVkX21haW50ZW5hbmNlX3RlY2huaWNpYW4iLCJyb2xlX2Jhc2Vfc3RhZmYiLCJyb2xlX2Jhc2Vfcm9wYV9zdGFmZiIsInJvbGVfYmFzZV9hY2NvdW50X293bmVyIl0sInNpZCI6IkI4MjNEMTc2QTBDRUQ2MTY3MDhBQzA0NTJGQ0RBREU2IiwiaWF0IjoxNzIwNDE2ODc5LCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIl0sImFtciI6WyJwd2QiXX0.juyRI_IdBc0DDFWSdy0dIbqbtz7wxGiS2iZbz41vodXLU0D3iweJsJq7LuLAyFp0N2nG5vY870K_N42F9MTuz_DngKjUfW3-IE2DMXLQ4EoZwYa631GFiuadeHXBBtInE9xkcqQL3Z3d_uMMrYrkrpA8BPq45IyBNeeU-8543AoZmoLFKWoDGRKxniRNJuWbRdvqxGigrIXEuCU1CVK2JnzcRfMB6OzbNjJLPfOATbyOZCM0C___G23mgNQTDQEu4TOlUFcpvtfBuIMlt9n5BMY-iwerhnetcSCkkq5wtvOUE1c1M5Jguf29PezXd38RnWTCyC1kt4zEp2U_aN6b8A',
      'User-Id': '6da7a9c4-d338-454e-b580-c46132f29f10' 
    });
    return this.http.post<any>(this.singleMachineMultipleDateUrl, payload, { headers });
  }
}
