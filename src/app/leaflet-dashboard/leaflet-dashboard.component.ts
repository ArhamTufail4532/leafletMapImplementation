import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MapDataService } from '../map-data.service';

@Component({
  selector: 'app-leaflet-dashboard',
  templateUrl: './leaflet-dashboard.component.html',
  styleUrls: ['./leaflet-dashboard.component.scss']
})
export class LeafletDashboardComponent {
  showButton:boolean = false;
  constructor(private mapDataService: MapDataService){

  }

  ngOnInit() {
    this.makeApiCall();
  }

  makeApiCall() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const payload = {
      "UserLanguage": "en",
      "CustomerNumber": 500000,
      "IsMapRender": true,
      "ShowRawDataOnly": true,
      "RequestedMachinesList": [
          {
              "SerialNumber": "6M2039",
              "RoleId": "204",
              "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
          }
      ],
      "Geohashes": [],
      "StartDateTime": formattedDate,
      "ZoomLevel": 11,
      "LegendStatus": [
          0,
          1,
          2,
          3
      ],
      "IsFirstRequest": true,
      "IsDateChanged": false,
      "Height": 500,
      "Width": 933,
      "MaxLat": 51.290397773626424,
      "MaxLng": 10.771820129394536,
      "MinLat": 51.0406641842671,
      "MinLng": 10.131179870605473,
      "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
    };
    this.mapDataService.getMachineLastPosition(payload).subscribe(
      data => {
        this.showButton = false;
        //console.log("data="+data);
      },
      error => {
        if (error.statusText === 'Unauthorized') {
          this.showButton = true;
        }
      }
    );
  }

  handleButtonClick() {
    this.showButton = false;
    console.log("button is off now!");
  }
}
