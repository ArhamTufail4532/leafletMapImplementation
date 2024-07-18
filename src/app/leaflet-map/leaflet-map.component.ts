import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-groupedlayercontrol';
import { MachineDataService } from '../machine-data.service';
import { MapDataService } from '../map-data.service';
import "leaflet.gridlayer.googlemutant";
import "leaflet.fullscreen";
import "src/assets/leaflet-gesture-handling.js";
import "src/assets/leaflet-control-defaulthome.js";
import "src/assets/leaflet-control-FixedView.js";
import "src/assets/leaflet-control-ImageView.js"
import "leaflet.markercluster";
import { __metadata } from 'tslib';
import "src/assets/leaflet-control-markers.js";
import { Lagends } from '../Models/Lagends.model';
import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';


  var date = [
    {
      "startDate":"2023-10-10",
      "endDate":"2023-10-19"
    }
  ]
interface Line {
    coordinates: { lat: number; lng: number }[]; 
    orderNumber: number;
    identifier: number;
    isIdentifierEnd: boolean;
    machine: string;
  }
@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
})

export class LeafletMapComponent implements OnInit, AfterViewInit {
  @Input() showZoomControl: boolean = true;
  @Input() showFullscreenControl: boolean = true;
  @Input() showScaleControl: boolean = true;
  @Input() showClusterControl: boolean = true;
  @Input() extendControl: boolean = true;
  @Input() dateRangePickerValue: boolean = true;
  @Input() legends: Lagends = new Lagends();
  @Input() ExtendViewData : boolean = false;
  dateRangeSelected: boolean = false;
    //allPolylineCoordinatesforDischarge: [number, number][] = [];
    polylinesforDischarge: L.Polyline[] = [];
    public minDate: Object = {};
    zoomLevelSet: boolean = false;
    private threshold: number = 0;
    public maxDate: Object =  {};
    private polylines: L.Polyline[] = [];
    private customMarkers : L.Marker[] = [];
    private imageControl: any;
    public _machineData : any;
    imageContentData : string = "";
    private _markers : any;    
    currentDate : any;
    markerClusterGroup: any;
    isZooming : boolean = false;
    isMoving : boolean = false;
    data: any;
    flag: number = 0;
    previousBounds : any;
    _lat : number = 52.096112667;
    _lng : number = 10.562562667;
    _machineName : string = "";
    value : boolean = false;
    _polyline : any;
    public _multipleDatesData : any;
    homeControl : any;
    index : any;
    _ZoomControl : any;
    isLoading = false;
    public selectedDate :any;
    private map: L.Map = {} as L.Map;
    public selectedImage: string = "";
    enabledDates: string[] = [];
    public minDates: Date = new Date('2022-07-01');
    public maxDates: Date = new Date('2024-07-31');

constructor(private _singleMechineData: MachineDataService,private mapDataService: MapDataService) { 
}

  ngOnInit(): void {
    this.loadMapData();
    this.fetchData();
    this.initializeEnabledDates();
    this.removeMap();
  }

  loadMapData(): void {
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
      "ZoomLevel": this.map.getZoom,
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
    this.isLoading = true;
    this.mapDataService.getMachineLastPosition(payload).subscribe(data => {
      this.isLoading = false;
      const { lat, lng } = data.machineLastPosition.mapInfoWindowCoordinate;

       if(this.showClusterControl==false){
        L.popup({
          offset:[1,6],
          keepInView:false,
          autoClose:false
        })
        .setLatLng([lat, lng])
        .setContent(popupData(data.machineLastPosition.infoWindowContent))
        .openOn(this.map); 
       }

      this.homeControl.setCenter([lat,lng]);
      this.homeControl.setZoom(8);
      this.map.setView([lat, lng],8);

    }, error => {
      console.error('Error fetching map data', error);
      this.isLoading = false;
    });
  }

  removeMap(): void{
    if(this.map){
      this.map.off();
      this.map.remove();
    } 
  }

  initializeEnabledDates(): void {
    for (let i = 0; i < this._machineData.length; i++) {
      if (this._machineData[i]?.machineCalculations?.time) {
        const machineDataDateString = this._machineData[i].machineCalculations.time.toString().split('T')[0];
        this.enabledDates.push(machineDataDateString);
      }
    }
    console.log(this.enabledDates);
  }

  fetchData():void{
    this._machineData = this._singleMechineData.getSingleMechineWithSingleDate();
    this._multipleDatesData = this._singleMechineData.getSingleMachineWithMultipleDates();
  }

  ngAfterViewInit(): void {
    this.initMap();
      if(this.extendControl==false && this.showClusterControl==false){
        this.map.on('zoomstart', () => this.isZooming = true);
        this.map.on('zoomend', this.debounce(() => this.onMapZoomEnd(), 2000));
        this.map.on('moveend', this.debounce(() => this.onMapMoveEnd(), 2000));
        this.map.on('movestart', () => this.isMoving = true);
        //this.map.on('moveend', ()=> this.onMapMoveEnd());
        //this.map.on('zoomend', ()=> this.onMapZoomEnd());
        //this.getSingleMachineMapViewData();
      }
      if(this.showClusterControl)
      { 
          this.loadMarker();
      }
  }

  private onMapZoomEnd() { 
    console.log("zoomend" + this.map.getZoom());
    if(this.dateRangeSelected==false){
      if(this.map.getZoom()==12 || this.map.getZoom()==14 || this.map.getZoom()==15 || this.map.getZoom()==18){
      this.getSingleMachineMapViewData();
      }else if(this.map.getZoom()<12){
        this.getSingleMachineMapViewData();
      }
    }
    setTimeout(() => {
      this.isZooming = false;
    }, 200);
  }

  private onMapMoveEnd() {
    if(this.dateRangeSelected==false)
    {
      if(!this.isZooming){
        console.log("this is move end event");
        this.getSingleMachineMapViewData();
      }
    }
    this.isMoving=false;
  } 
  removeMapEventListeners(): void {
   // this.map.off('moveend', this.onMapMoveEnd);
   // this.map.off('zoomend', this.onMapZoomEnd);
  }

  private createPayload(bounds: L.LatLngBounds) {
    this.currentDate = this._singleMechineData.getDate() || new Date().toISOString();
    console.log("current date is"+this.currentDate); 
    
    return {
      "UserLanguage": "en",
      "CustomerNumber": 500000,
      "IsMapRender": true,
      "ShowRawDataOnly": false,
      "RequestedMachinesList": [
          {
              "SerialNumber": "6M2039",
              "RoleId": "204",
              "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
          }
      ],
      "Geohashes": [],
      "StartDateTime": this.currentDate,
      "EndDateTime": this.currentDate,
      "LegendStatus": [1, 3, 0, 2],
      "ZoomLevel": this.map.getZoom(),
      "Height": 600, 
      "Width": 1896,
      "IsFirstRequest": false,
      "MaxLat": bounds.getNorthEast().lat,
      "MaxLng": bounds.getNorthEast().lng,
      "MinLat": bounds.getSouthWest().lat,
      "MinLng": bounds.getSouthWest().lng,
      "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
    };
  }


  private clearMap() {
    // Remove previous polylines and markers
    this.polylines.forEach(polyline => polyline.remove());
    this.customMarkers.forEach(marker => marker.remove());
    this.map.closePopup();
    this.polylines = [];
    this.customMarkers = [];
}

debounce(func: () => void, wait: number) {
  let timeout: any;
  return function executedFunction() {
    const later = () => {
      clearTimeout(timeout);
      func(); // Call the original function directly without arguments
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

onDateRangeChange(event: any): void {
  this.dateRangeSelected = true;
  console.log("dateRangeValue" + this.dateRangeSelected);
  this.removeMapEventListeners();
  const startDate = event.startDate;
  const endDate = event.endDate;
  console.log("start Date"+startDate);
  console.log("end Date"+endDate);
  const startDateYear = startDate.getFullYear();
    const startDateMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const startDateDay = startDate.getDate().toString().padStart(2, '0');
    const startDateFormate = `${startDateYear}-${startDateMonth}-${startDateDay}T00:00:00.000Z`;

    const endDateYear = endDate.getFullYear();
    const endDateMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const endDateDay = endDate.getDate().toString().padStart(2, '0');
    const endDateFormate = `${endDateYear}-${endDateMonth}-${endDateDay}T00:00:00.000Z`;
    this.clearMapData();
    this._singleMechineData.setStartDate(startDateFormate);
    this._singleMechineData.setEndDate(endDateFormate);
    this.getSingleMachineMapViewDataForExtend(startDateFormate,endDateFormate);
    //this.map.on('moveend', ()=> this.loadDateRangeData());
    this.map.on('zoomstart', () => this.isZooming = true);
    this.map.on('zoomend', this.debounce(() => this.handleZoomEnd(), 2000));
    this.map.on('movestart', () => this.isMoving = true);
    this.map.on('moveend', this.debounce(() => this.handleMoveEnd(), 2000));
    //this.fetchMapDataForExdendView(startDateFormate,endDateFormate);
}

handleMoveEnd(){
  const bounds = this.map.getBounds();
    const payload = this.createPayloadForExtend(bounds,this._singleMechineData.getStartDate(),this._singleMechineData.getEndDate());
    if(!this.isZooming){
      console.log("this is move end method");
      console.log("move end method runs... because" + this.isZooming);
      this.fetchAndUpdateMapDataForExtendforMapData(payload);
    }
  this.isMoving=false;
}

handleZoomEnd(){
  const bounds = this.map.getBounds();
  const payload = this.createPayloadForExtend(bounds,this._singleMechineData.getStartDate(),this._singleMechineData.getEndDate());
  console.log("this is zoom end method");
  console.log("zoomend" + this.map.getZoom());
  if(this.map.getZoom()==12 || this.map.getZoom()==15 || this.map.getZoom()==18){
    this.fetchAndUpdateMapDataForExtendforMapData(payload);
  }else if(this.map.getZoom()<12){
    console.log("other bounds loaded!");
    const bounds = this.map.getBounds();
    const payload = this.createPayloadForExtend(bounds,this._singleMechineData.getStartDate(),this._singleMechineData.getEndDate());
    this.fetchAndUpdateMapDataForExtendforMapData(payload);
  } 
   setTimeout(() => {
    this.isZooming = false;
  }, 200);
}

private getSingleMachineMapViewDataForExtend(startDate:string,endDate:string) {
  const bounds = this.map.getBounds();
  const payload = this.createPayloadForExtend(bounds,startDate,endDate);
  this.fetchAndUpdateMapDataForExtend(payload);
}
onDateRangeChangeForMapView(event : any):void{
  this.dateRangeSelected = true;
  const startDate = event.startDate;
  const endDate = event.endDate;
  console.log("start Date"+startDate);
  console.log("end Date"+endDate);
  const startDateYear = startDate.getFullYear();
    const startDateMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const startDateDay = startDate.getDate().toString().padStart(2, '0');
    const startDateFormate = `${startDateYear}-${startDateMonth}-${startDateDay}T00:00:00.000Z`;

    const endDateYear = endDate.getFullYear();
    const endDateMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const endDateDay = endDate.getDate().toString().padStart(2, '0');
    const endDateFormate = `${endDateYear}-${endDateMonth}-${endDateDay}T00:00:00.000Z`;
    this.clearMapData();
    this._singleMechineData.setStartDateforMapView(startDateFormate);
    this._singleMechineData.setEndDateforMapView(endDateFormate);
    this.getMultipleMachineWithMultipleDates(startDateFormate,endDateFormate);
       //this.map.on('moveend', () => this.getMultipleMachineForMapView());
       this.map.on('zoomstart', () => this.isZooming = true);
       this.map.on('zoomend', this.debounce(() => this.handleZoomEndForMapView(), 2000)); 
       this.map.on('movestart', () => this.isMoving = true);
       this.map.on('moveend', this.debounce(() => this.handleMoveEndForMapView(), 2000));
       /* this.map.on('zoomstart', () => this.isZooming = true);
       this.map.on('zoomend', this.debounce(() => this.handleZoomEnd(), 2000));
       this.map.on('movestart', () => this.isMoving = true);
       this.map.on('moveend', this.debounce(() => this.handleMoveEnd(), 2000)); */
}

private getMultipleMachineWithMultipleDates(startDate:string,endDate:string) {
  const bounds = this.map.getBounds();
  const payload = this.createPayloadForMapView(bounds,startDate,endDate);
  this.FetchDataForMapView(payload);
}
private handleMoveEndForMapView(){
  const bounds = this.map.getBounds();
  const payload = this.createPayloadForMapView(bounds,this._singleMechineData.getStartDateforMapView(),this._singleMechineData.getEndDateforMapView());
  if(!this.isZooming){
    this.FetchDataForMapViewMultipleMachines(payload);
  }
  this.isMoving=false;
}
private handleZoomEndForMapView(){
  const bounds = this.map.getBounds();
  console.log("this is zoom end method");
  console.log("zoomend" + this.map.getZoom());
  const payload = this.createPayloadForMapView(bounds,this._singleMechineData.getStartDateforMapView(),this._singleMechineData.getEndDateforMapView());
  if(this.map.getZoom()==12 || this.map.getZoom()==15 || this.map.getZoom()==18){
    this.FetchDataForMapViewMultipleMachines(payload);
  }else if(this.map.getZoom()<12){
    const bounds = this.map.getBounds();
    const payload = this.createPayloadForMapView(bounds,this._singleMechineData.getStartDateforMapView(),this._singleMechineData.getEndDateforMapView());
    this.FetchDataForMapViewMultipleMachines(payload);
  }
  setTimeout(() => {
    this.isZooming = false;
  }, 200);
}

FetchDataForMapViewMultipleMachines(payload:any){
  this.isLoading = true;
    let legend = document.querySelector('.green-box-legend') as HTMLElement;
    legend.style.display = 'none';
    const allCoordinates: [number, number][] = [];
    if (this._markers) {
      this._markers.clearLayers();
    }
    //this.clearMap();
    //setTimeout(() => {
      this.mapDataService.getMultipleMachineWithMultipleDates(payload).subscribe(data => {
        this.isLoading = false;
        if (this._markers) {
          this._markers.clearLayers();
        }
        this.clearMap();
        const mapInfoWindow = data.mapInfoWindowDto.harvestingMapInfoWindows;
          mapInfoWindow.forEach((infoWindow: { mapInfoWindowCoordinate: { lat: any; lng: any; }; infoWindowContent: any; }) => {
          const{ lat , lng } = infoWindow.mapInfoWindowCoordinate;
          var tooltip = L.tooltip({
            direction:'top',
            permanent:true,
            interactive:true,
            offset:[-15,26],
          })
          .setLatLng([lat, lng])
          .setContent(popupData(infoWindow.infoWindowContent));
    
          var marker = L.marker([lat, lng],{
            opacity:0,
          });
          marker.bindTooltip(tooltip);
          marker.openTooltip();
          this._markers.addLayer(marker);
          });
          /* if(this.zoomLevelSet==false){
            console.log(this.zoomLevelSet);
            this.map.setView(this._markers.getBounds().getCenter(), 18); 
            this.zoomLevelSet = true;
          }else{

          } */
        this.map.addLayer(this._markers);
        let allPolylineCoordinates: [number, number][] = [];
        data.machinePolylineDto.roadTripLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#7acdef" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });

        data.machinePolylineDto.harvestingPolygonPath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polygon = (L.polygon as any)(coordinates as any,{
            color:"#ffd800",
            fillColor:"#ffd800",
            fillOpacity: 1
        }).addTo(this.map);
        this.polylines.push(polygon);
          allPolylineCoordinates.push(coordinates as any);
        });
        data.machinePolylineDto.harvestingLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#ffd800" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });
        data.machinePolylineDto.notHarvestingLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#E37056" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });
          


        let zoom = this.map.getZoom();
        console.log("zoom value"+zoom);
        if(zoom>16){
          const bound = this.map.getBounds();
          this.mapDataService.getLegendData(this.createPayloadForLegend(bound,this._singleMechineData.getStartDateforMapView(),this._singleMechineData.getEndDateforMapView())).subscribe(data => {
            legend.setAttribute('style', 'display: inline-block !important;');
          data.dischargeLinePath.forEach((line: { coordinates: any[]; })=>{
            const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
              color:"#84b960",
              fillColor:"#84b960",
              fillOpacity: 1
          }).addTo(this.map);
          this.polylinesforDischarge.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
          });
          data.dischargeWithoutCircleLinePath.forEach((line: { coordinates: any[]; })=>{
            const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
              color:"#84b960",
              fillColor:"#84b960",
              fillOpacity: 1
          }).addTo(this.map);
          this.polylinesforDischarge.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
          });
          },error => {
            console.error('Error fetching map data', error);
            });
          
        }else{
          legend.style.display = 'none';
          this.polylinesforDischarge.forEach(polyline => {
            this.map.removeLayer(polyline);
            console.log("polylines remove");
          });
        }
        
  
        const customIcon = L.icon({
          iconUrl: './assets/red-flag.png',
          iconSize: [64, 64], 
          iconAnchor: [10, 64]
        });
    
        const Markerdata = data.mapMarkerDto.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: any; }) =>{
          const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
          .addTo(this.map);
          this.customMarkers.push(customMarker);
    
          const label = L.divIcon({
            className: 'label-icon',
            html: `<div>${marker.markerLabel}</div>`,
            iconSize: [64, 64], // Adjusted iconSize if needed
            iconAnchor: [10, 55] // Example adjustment for label position
          });
    
          const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
            .addTo(this.map);
    
            this.customMarkers.push(labelMarker);
        });
    }, error => {
    console.error('Error fetching map data', error);
    this.isLoading = false;
    });
    //}, 1000);
}


private fetchAndUpdateMapDataForExtend(payload:any){
    let legend = document.querySelector('.green-box-legend') as HTMLElement;
    legend.style.display = 'none';
  this.isLoading = true;
   this.mapDataService.getSingleMachineMapViewDataForExtendView(payload).subscribe(data => {
    this.isLoading = false;
    this.clearMap();
    let allPolylineCoordinates: [number, number][] = [];
        data.mapData.roadTripLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
              color:"#7acdef" 
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        });
        data.mapData.harvestingPolygonPath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polygon = L.polygon(coordinates as any,{
              color:"#ffd800",
              fill:true
          }).addTo(this.map);
          this.polylines.push(polygon as any);
          allPolylineCoordinates.push(coordinates as any);
        }); 
        data.mapData.harvestingLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#ffd800"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        });
        data.mapData.notHarvestingLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
              color:"#E37056"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        });
        var zoomlevel = this.map.getZoom();
          console.log("zoom level is " + zoomlevel);
          if(zoomlevel > 16)
          {
            legend.style.display = 'inline-block';
            data.mapData.dischargeLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
              color:"#84b960"
          }).addTo(this.map);
          this.polylinesforDischarge.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        });
        } else if(zoomlevel<16){
        legend.style.display = 'none';
        this.polylinesforDischarge.forEach(polyline => {
          this.map.removeLayer(polyline);
          console.log("polylines remove");
        });
        this.polylinesforDischarge = [];
      }
    
      data.mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
                color:"#84b960"
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
      });   
      data.mapData.timelyGapLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#fd7e14"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
      });  
       

     const customIcon = L.icon({
      iconUrl: './assets/red-flag.png',
      iconSize: [64, 64],
      iconAnchor: [10, 64]
    });


    const markerdata = data.mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
    const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
    .addTo(this.map);
    this.customMarkers.push(customMarker);


    const label = L.divIcon({
      className: 'label-icon',
      html: `<div>${marker.markerLabel}</div>`,
      iconSize: [64, 64], 
      iconAnchor: [10, 55]
    });

    const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
    .addTo(this.map);

    this.customMarkers.push(labelMarker);
    }); 

    if (data.imageData!=null) {
      this.markerClusterGroup = (L as any).markerClusterGroup({
        iconCreateFunction: function (cluster:any) {
          var markers = cluster.getAllChildMarkers();
          var html = '<div class="circle"><span class="cluster-content">' + markers.length + '</span></div>';
          return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
      },
      });
      if (!this.imageControl) {
        this.imageControl = (L.control as any).ImageControl({
          position: 'topright',
          markerClusterGroup: this.markerClusterGroup,
        }).addTo(this.map);
      }else{
        this.imageControl.updateMarkerClusterGroup(this.markerClusterGroup);
      }
    } 
    else{
      if (this.imageControl) {
        this.imageControl.remove();
        this.imageControl = null;
      }
    }

    if(data.imageData)
    {
        //this.markerClusterGroup.clearLayers();
        var imagedata = data.imageData.forEach((image :any) =>{
          const cameraType = image.cameraType;
          const imagePath = image.path;
          var tooltip = L.tooltip({
            direction:'top',
            permanent:true,
            interactive:true,
            offset:[-15,26],
          })
          .setLatLng([image.gpsLatitude, image.gpsLongitude])
          .setContent(tooltipData(cameraType,imagePath));
          const marker = L.marker([image.gpsLatitude, image.gpsLongitude],{
            opacity:0
          }).bindTooltip(tooltip).openTooltip();
          this.markerClusterGroup.addLayer(marker);
          marker.on('click', (e: any) => {
            const target = e.originalEvent.target as HTMLElement;
            if (target.classList.contains('tooltip-image')) {
              this.selectedImage = image.path;
              console.log(this.selectedImage);
            }
          });
        });
        //this.map.addLayer(this.markerClusterGroup);
    }else{
    }  
         if (allPolylineCoordinates.length > 0) {
          const bounds = L.latLngBounds(allPolylineCoordinates);
          this.map.fitBounds(bounds);
          const center = bounds.getCenter();
          if (!isNaN(center.lat) && !isNaN(center.lng)) {
            this.homeControl.setCenter(center);
            this.homeControl.setZoom(this.map.getBoundsZoom(bounds));
            console.log("Map data fit correctly!");
          }
        } 

   console.log("data loaded successfullys!");
  }, error => {
    console.error('Error fetching map data', error);
    this.isLoading = false;
  }); 
}
private fetchAndUpdateMapDataForExtendforMapData(payload:any){
  let legend = document.querySelector('.green-box-legend') as HTMLElement;
  legend.style.display = 'none';
  console.log("zoom level is equal to " + this.map.getZoom());
  //if(this.map.getZoom()==6  || this.map.getZoom()==6 ||  || this.map.getZoom()==12 || this.map.getZoom()==14 || this.map.getZoom()==16 || this.map.getZoom()==18){
    this.isLoading = true;
    console.log("multiple Machine with extend View!");
    //setTimeout(() => {
      this.mapDataService.getSingleMachineMapViewDataForExtendView(payload).subscribe(data => {
        this.isLoading = false;
          this.clearMap();
          let allPolylineCoordinates: [number, number][] = [];
              data.mapData.roadTripLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                    color:"#7acdef" 
                }).addTo(this.map);
                this.polylines.push(polyline);
                allPolylineCoordinates.push(coordinates as any);
              });
              data.mapData.harvestingPolygonPath.forEach((line:Line) =>{
                const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                const polygon = L.polygon(coordinates as any,{
                    color:"#ffd800",
                    fill:true
                }).addTo(this.map);
                this.polylines.push(polygon as any);
                allPolylineCoordinates.push(coordinates as any);
              });
              data.mapData.harvestingLinePath.forEach((line:Line) =>{
                const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                const polyline = L.polyline(coordinates as any,{
                    color:"#ffd800"
                }).addTo(this.map);
                this.polylines.push(polyline);
                allPolylineCoordinates.push(coordinates as any);
              });
              data.mapData.notHarvestingLinePath.forEach((line:Line) =>{
                const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                    const polyline = L.polyline(coordinates as any,{
                    color:"#E37056"
                }).addTo(this.map);
                this.polylines.push(polyline);
                allPolylineCoordinates.push(coordinates as any);
              });
              var zoomlevel = this.map.getZoom();
                console.log("zoom level is " + zoomlevel);
                if(zoomlevel > 16)
                {
                  legend.style.display = 'inline-block';
                  data.mapData.dischargeLinePath.forEach((line:Line) =>{
                  const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                    color:"#84b960"
                }).addTo(this.map);
                this.polylinesforDischarge.push(polyline);
                allPolylineCoordinates.push(coordinates as any);
                  });
                  data.mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
                    const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                    const polyline = L.polyline(coordinates as any,{
                        color:"#84b960"
                    }).addTo(this.map);
                    this.polylinesforDischarge.push(polyline);
                    allPolylineCoordinates.push(coordinates as any);
                  });
              } else if(zoomlevel<16){
              legend.style.display = 'none';
              this.polylinesforDischarge.forEach(polyline => {
                this.map.removeLayer(polyline);
                console.log("polylines remove");
              });
              this.polylinesforDischarge = [];
            }   
            data.mapData.timelyGapLinePath.forEach((line:Line) =>{
                const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                const polyline = L.polyline(coordinates as any,{
                    color:"#fd7e14"
                }).addTo(this.map);
                this.polylines.push(polyline);
                allPolylineCoordinates.push(coordinates as any);
            });    
           const customIcon = L.icon({
            iconUrl: './assets/red-flag.png',
            iconSize: [64, 64],
            iconAnchor: [10, 64]
          });
        
        
          const markerdata = data.mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
          const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
          .addTo(this.map);
          this.customMarkers.push(customMarker);
        
        
          const label = L.divIcon({
            className: 'label-icon',
            html: `<div>${marker.markerLabel}</div>`,
            iconSize: [64, 64], 
            iconAnchor: [10, 55]
          });
        
          const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
          .addTo(this.map);
        
          this.customMarkers.push(labelMarker);
          }); 
        
          /* if (data.imageData.length > 0) {
            this.markerClusterGroup = (L as any).markerClusterGroup({
              iconCreateFunction: function (cluster:any) {
                var markers = cluster.getAllChildMarkers();
                var html = '<div class="circle"><span class="cluster-content">' + markers.length + '</span></div>';
                return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
            },
            });
            if (!this.imageControl) {
              this.imageControl = (L.control as any).ImageControl({
                position: 'topright',
                markerClusterGroup: this.markerClusterGroup,
              }).addTo(this.map);
            }else{
              this.imageControl.updateMarkerClusterGroup(this.markerClusterGroup);
            }
          } 
          else{
            if (this.imageControl) {
              this.imageControl.remove();
              this.imageControl = null;
            }
          }
        
          if(data.imageData)
          {
              //this.markerClusterGroup.clearLayers();
              var imagedata = data.imageData.forEach((image :any) =>{
                const cameraType = image.cameraType;
                const imagePath = image.path;
                var tooltip = L.tooltip({
                  direction:'top',
                  permanent:true,
                  interactive:true,
                  offset:[-15,26],
                })
                .setLatLng([image.gpsLatitude, image.gpsLongitude])
                .setContent(tooltipData(cameraType,imagePath));
                const marker = L.marker([image.gpsLatitude, image.gpsLongitude],{
                  opacity:0
                }).bindTooltip(tooltip).openTooltip();
                this.markerClusterGroup.addLayer(marker);
                marker.on('click', (e: any) => {
                  const target = e.originalEvent.target as HTMLElement;
                  if (target.classList.contains('tooltip-image')) {
                    this.selectedImage = image.path;
                    console.log(this.selectedImage);
                  }
                });
              });
              //this.map.addLayer(this.markerClusterGroup);
          }else{
          }  */  
            /* if (allPolylineCoordinates.length > 0) {
              const bounds = L.latLngBounds(allPolylineCoordinates);
              this.map.fitBounds(bounds);
              const center = bounds.getCenter();
              if (!isNaN(center.lat) && !isNaN(center.lng)) {
                this.homeControl.setCenter(center);
                this.homeControl.setZoom(this.map.getBoundsZoom(bounds));
                console.log("Map data fit correctly!");
              }
          }  */
         console.log("data loaded successfully!");
        }, error => {
          console.error('Error fetching map data', error);
          this.isLoading = false;
        }); 
   // }, 2000);
  //}
    
}
private createPayloadForExtend(bounds: L.LatLngBounds,startDate:string,endDate:string){

  const mapContainer = this.map.getContainer();
  const height = mapContainer.clientHeight;
  const width = mapContainer.clientWidth;
  return {
    "UserLanguage": "en",
    "CustomerNumber": 500000,
    "IsMapRender": true,
    "ShowRawDataOnly": false,
    "RequestedMachinesList": [
        {
            "SerialNumber": "6M2039",
            "RoleId": "204",
            "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
        }
    ],
    "Geohashes": [],
    "StartDateTime": startDate,
    "EndDateTime": endDate,
    "LegendStatus": [1, 3, 0, 2],
    "ZoomLevel": this.map.getZoom(),
    "Height": height, 
    "Width": width,
    "IsFirstRequest": false,
    "MaxLat": bounds.getNorthEast().lat,
    "MaxLng": bounds.getNorthEast().lng,
    "MinLat": bounds.getSouthWest().lat,
    "MinLng": bounds.getSouthWest().lng,
    "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
  };
}
private createPayloadForMapView(bounds: L.LatLngBounds,startDate:string,endDate:string){
  const mapContainer = this.map.getContainer();
  const height = mapContainer.clientHeight;
  const width = mapContainer.clientWidth;
  return {"UserLanguage": "en",
      "CustomerNumber": 500000,
      "IsMapRender": false,
      "ShowRawDataOnly": false,
      "RequestedMachinesList": [
          {
              "SerialNumber": "6M2039",
              "RoleId": "204",
              "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
          }
      ],
      "Geohashes": [],
      "LegendStatus": [
          0,
          1,
          2
      ],
      "ZoomLevel": this.map.getZoom(),
      "IsFirstRequest": false,
      "Height": height,
      "Width": width,
     "MaxLat": bounds.getNorthEast().lat,
    "MaxLng": bounds.getNorthEast().lng,
    "MinLat": bounds.getSouthWest().lat,
    "MinLng": bounds.getSouthWest().lng,
      "StartDateTime": startDate,
      "EndDateTime": endDate,
      "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"}
}
private createPayloadForLegend(bounds: L.LatLngBounds,startDate:string,endDate:string){
  return {
    "UserLanguage": "en",
    "CustomerNumber": 500000,
    "IsMapRender": false,
    "ShowRawDataOnly": false,
    "RequestedMachinesList": [
        {
            "SerialNumber": "6M2039",
            "RoleId": "204",
            "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
        }
    ],
    "Geohashes": [
        "u0z1dn",
        "u0z1dq",
        "u0z1dw",
        "u0z1dp",
        "u0z1dr",
        "u0z1dx"
    ],
    "LegendStatus": [
        3
    ],
    "ZoomLevel": this.map.getZoom(),
    "MaxLat": bounds.getNorthEast().lat,
    "MaxLng": bounds.getNorthEast().lng,
    "MinLat": bounds.getSouthWest().lat,
    "MinLng": bounds.getSouthWest().lng,
    "StartDateTime": startDate,
    "EndDateTime": endDate,
    "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
}
}
private fetchMapDataForExdendView(startDate:string,endDate:string){
  const payload = {
    "UserLanguage": "en",
    "CustomerNumber": 500000,
    "IsMapRender": false,
    "ShowRawDataOnly": false,
    "RequestedMachinesList": [
        {
            "SerialNumber": "6M2039",
            "RoleId": "204",
            "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
        }
    ],
    "Geohashes": [],
    "StartDateTime": startDate,
    "EndDateTime": endDate,
    "LegendStatus": [
        0,
        3,
        1,
        2
    ],
    "ZoomLevel": 10,
    "Height": 600,
    "Width": 1000,
    "IsFirstRequest": true,
    "MaxLat": 49.78311868310709,
    "MaxLng": 10.59209992481251,
    "MinLat": 49.4271353770986,
    "MinLng": 9.21880890918751,
    "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
  }
  this.isLoading = true; 
  this.mapDataService.getSingleMachineMapViewDataForExtendView(payload).subscribe(
    
    data => {
      this.isLoading = false;
      let allPolylineCoordinates: [number, number][] = [];
  
      data.mapData.roadTripLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#7acdef" 
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
      });
  
      data.mapData.harvestingLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#ffd800"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
      });
  
      data.mapData.notHarvestingLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
              color:"#E37056"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
      });
      data.mapData.harvestingPolygonPath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polygon = L.polygon(coordinates as any,{
            color:"#ffd800",
        }).addTo(this.map);
        this.polylines.push(polygon as any);
        allPolylineCoordinates.push(coordinates as any);
      }); 
    },error => {
      console.error('Error fetching map data', error);
      this.isLoading = false;
    }
  )
} 

  private fetchAndUpdateMapData(payload: any) {
      let legend = document.querySelector('.green-box-legend') as HTMLElement;
      legend.style.display = 'none';
    this.isLoading = true;
    setTimeout(() => {
      this.mapDataService.getSingleMachineMapViewDataForExtendView(payload).subscribe(data => {
        this.isLoading = false;
        this.clearMap();

        if(data.mapData.roadTripLinePath.length<=0){
          const lat = data.mapCenterCoordinate.lat;
          const lng = data.mapCenterCoordinate.lng;
          L.popup({
            offset:[1,6],
            keepInView:false,
            autoClose:false
          })
          .setLatLng([lat, lng])
          .setContent(popupData("6M2039"))
          .openOn(this.map); 
  
        this.homeControl.setCenter([lat,lng]);
        //this.homeControl.setZoom(8);
        //this.map.setView([lat, lng]);
        }
        
        let allPolylineCoordinates: [number, number][] = [];
            data.mapData.roadTripLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
                  color:"#7acdef" 
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
            });
            data.mapData.harvestingPolygonPath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polygon = L.polygon(coordinates as any,{
                  color:"#ffd800",
              }).addTo(this.map);
              this.polylines.push(polygon as any);
              allPolylineCoordinates.push(coordinates as any);
            });
            data.mapData.harvestingLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                  color:"#ffd800"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
            });
            data.mapData.notHarvestingLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                  color:"#E37056"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
            });
  
            var zoomlevel = this.map.getZoom();
              console.log("zoom level is " + zoomlevel);
              if(zoomlevel > 16)
              {
                legend.style.display = 'inline-block';
                data.mapData.dischargeLinePath.forEach((line:Line) =>{
                const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                const polyline = L.polyline(coordinates as any,{
                color:"#84b960"
              }).addTo(this.map);
              this.polylinesforDischarge.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
                });
                data.mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
                  const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                      color:"#84b960"
                  }).addTo(this.map);
                  this.polylines.push(polyline);
                  allPolylineCoordinates.push(coordinates as any);
            }); 
            }  else if(zoomlevel<16){
            legend.style.display = 'none'; 
          }  
          data.mapData.timelyGapLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                  color:"#fd7e14"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
          });  
            
  
         const customIcon = L.icon({
          iconUrl: './assets/red-flag.png',
          iconSize: [64, 64],
          iconAnchor: [10, 64]
          });
    
    
        const markerdata = data.mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
        const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
        .addTo(this.map);
        this.customMarkers.push(customMarker);
    
    
        const label = L.divIcon({
          className: 'label-icon',
          html: `<div>${marker.markerLabel}</div>`,
          iconSize: [64, 64], 
          iconAnchor: [10, 55]
        });
    
        const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
        .addTo(this.map);
    
        this.customMarkers.push(labelMarker);
        }); 
            if(this.flag==0){
              if (allPolylineCoordinates.length > 0) {
                this.flag=1;
                console.log("enter the fit bound code");
                const bounds = L.latLngBounds(allPolylineCoordinates);
                this.map.fitBounds(bounds);
                const center = bounds.getCenter();
                if (!isNaN(center.lat) && !isNaN(center.lng)) {
                  this.homeControl.setCenter(center);
                  this.homeControl.setZoom(this.map.getBoundsZoom(bounds));
                }
              }
            }
       console.log("data loaded successfullys!");
  
      }, error => {
        console.error('Error fetching map data', error);
        this.isLoading = false;
      });
    }, 3000); 
  }

  private getSingleMachineMapViewData() {
    const bounds = this.map.getBounds();
    const payload = this.createPayload(bounds);
    this.fetchAndUpdateMapData(payload);
  } 
  
  private loadMarker(): void {
    const bounds = this.map.getBounds();
    var selectedDate = new Date();
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const selectedDay = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}T00:00:00.000Z`; 
    const payload = this.createPayloadForMapView(bounds,formattedDate,formattedDate);
    this.FetchDataForMapView(payload);     
  }

  FetchDataForMapView(payload:any){
    this.isLoading = true;
    let legend = document.querySelector('.green-box-legend') as HTMLElement;
    legend.style.display = 'none';
    const allCoordinates: [number, number][] = [];
    if (this._markers) {
      this._markers.clearLayers();
    }
    this.clearMap();
    //setTimeout(() => {
      this.mapDataService.getMultipleMachineWithMultipleDates(payload).subscribe(data => {
        this.isLoading = false;
        const mapInfoWindow = data.mapInfoWindowDto.harvestingMapInfoWindows;
          mapInfoWindow.forEach((infoWindow: { mapInfoWindowCoordinate: { lat: any; lng: any; }; infoWindowContent: any; }) => {
          const{ lat , lng } = infoWindow.mapInfoWindowCoordinate;
          var tooltip = L.tooltip({
            direction:'top',
            permanent:true,
            interactive:true,
            offset:[-15,26],
          })
          .setLatLng([lat, lng])
          .setContent(popupData(infoWindow.infoWindowContent));
    
          var marker = L.marker([lat, lng],{
            opacity:0,
          });
          marker.bindTooltip(tooltip);
          marker.openTooltip();
          this._markers.addLayer(marker);
          });
          /* if(data.roadTripLinePath==null)
          {
            this.map.setZoom(18);
          } */
          
          /* if(this.zoomLevelSet==false){
            console.log(this.zoomLevelSet);
            this.map.setView(this._markers.getBounds().getCenter(), 18); 
            this.zoomLevelSet = true;
          }else{

          } */
        this.map.addLayer(this._markers);
        let allPolylineCoordinates: [number, number][] = [];
        data.machinePolylineDto.roadTripLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#7acdef" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });
        data.machinePolylineDto.harvestingLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#ffd800" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });
        data.machinePolylineDto.notHarvestingLinePath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polyline = L.polyline(coordinates as any,{
            color:"#E37056" 
          }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
        });
         data.machinePolylineDto.harvestingPolygonPath.forEach((line: { coordinates: any[]; })=>{
          const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
          const polygon = (L.polygon as any)(coordinates as any,{
            color:"#ffd800",
            fillColor:"#ffd800",
            fillOpacity: 1
        }).addTo(this.map);
        this.polylines.push(polygon);
          allPolylineCoordinates.push(coordinates as any);
        }); 


        let zoom = this.map.getZoom();
        console.log("zoom value"+zoom);
        if(zoom>16){
          //legend.style.display = 'inline-block !important';
          legend.setAttribute('style', 'display: inline-block !important;');
          data.machinePolylineDto.dischargeLinePath.forEach((line: { coordinates: any[]; })=>{
            const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
              color:"#84b960",
              fillColor:"#84b960",
              fillOpacity: 1
          }).addTo(this.map);
          this.polylinesforDischarge.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
          });
          data.machinePolylineDto.dischargeWithoutCircleLinePath.forEach((line: { coordinates: any[]; })=>{
            const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
              color:"#84b960",
              fillColor:"#84b960",
              fillOpacity: 1
          }).addTo(this.map);
          this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
          });
        }else{
          legend.style.display = 'none';
        }
        
  
        const customIcon = L.icon({
          iconUrl: './assets/red-flag.png',
          iconSize: [64, 64], 
          iconAnchor: [10, 64]
        });
    
        const Markerdata = data.mapMarkerDto.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: any; }) =>{
          const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
          .addTo(this.map);
          this.customMarkers.push(customMarker);
    
          const label = L.divIcon({
            className: 'label-icon',
            html: `<div>${marker.markerLabel}</div>`,
            iconSize: [64, 64], // Adjusted iconSize if needed
            iconAnchor: [10, 55] // Example adjustment for label position
          });
    
          const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
            .addTo(this.map);
    
            this.customMarkers.push(labelMarker);
        });

        if (allPolylineCoordinates.length > 0) {
          const bounds = L.latLngBounds(allPolylineCoordinates);
          this.map.fitBounds(bounds);
          const center = bounds.getCenter();
          if (!isNaN(center.lat) && !isNaN(center.lng)) {
            this.homeControl.setCenter(center);
            this.homeControl.setZoom(this.map.getBoundsZoom(bounds));
            console.log("Map data fit correctly!");
          }
        }
    }, error => {
    console.error('Error fetching map data', error);
    this.isLoading = false;
    });
   // }, 1000);
}


  
/*   onRenderDayCell(args: RenderDayCellEventArgs): void {
    const date = args.date;
    if (date) {
      const dateString = this.getLocalDateString(date);
      const isEnabled = this.enabledDates.includes(dateString);
      if (!isEnabled) {
        args.isDisabled = true;
      }
    }
  } */


  closePreview() {
    this.selectedImage = '';
  }

  onDateSelected(args : any): void {
    let selectedDate = args.value;
    if (!selectedDate) {
      console.error("No date selected");
      return;
    }
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const selectedDay = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}T00:00:00.000Z`;
    this._singleMechineData.setDate(formattedDate);
    console.log("this is my date"+this._singleMechineData.getDate());
    this.clearMapData();
    this.fetchMapData(formattedDate);
  }

  private clearMapData(): void {

    this.map.closePopup();

    this.polylines.forEach(polyline => this.map.removeLayer(polyline));
    this.polylines = [];
  

    this.customMarkers.forEach(marker => {
      if (this.map.hasLayer(marker)) {
        this.map.removeLayer(marker);
      }
    });
    this.customMarkers = [];
  

    if (this.markerClusterGroup) {
      this.map.removeLayer(this.markerClusterGroup);
      this.markerClusterGroup = null;
    }
  

    if (this.imageControl) {
      this.imageControl.remove();
      this.imageControl = null;
    }
    if (this._markers) {
      this._markers.clearLayers();
    }
  }
  fetchMapData(startDate: string): void {
    const payload = {
        "UserLanguage": "en",
        "CustomerNumber": 500000,
        "IsMapRender": false,
        "ShowRawDataOnly": true,
        "RequestedMachinesList": [
            {
                "SerialNumber": "6M2039",
                "RoleId": "204",
                "LicenseId": "3e43c110-5149-42f3-a690-bcfdd7238cb6"
            }
        ],
        "Geohashes": [],
        "StartDateTime": startDate,
        "ZoomLevel": 11,
        "LegendStatus": [
            0,
            1,
            2,
            3
        ],
        "IsFirstRequest": true,
        "IsDateChanged": true,
        "Height": 500,
        "Width": 933,
        "MaxLat": 49.81919383648399,
        "MaxLng": 10.221246962394547,
        "MinLat": 49.56155676594064,
        "MinLng": 9.580606703605484,
        "LoggedInUserId": "6da7a9c4-d338-454e-b580-c46132f29f10"
    };
    this.isLoading = true;
    this.mapDataService.getSingleMachineDataWithMultipleDates(payload).subscribe(
      data => {
        this.isLoading = false;
        let allPolylineCoordinates: [number, number][] = [];
    
        data.mapData.roadTripLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
                color:"#7acdef" 
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
        });
    
        data.mapData.harvestingLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
                color:"#ffd800"
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
        });
    
        data.mapData.notHarvestingLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                const polyline = L.polyline(coordinates as any,{
                color:"#E37056"
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
        });
    
        data.mapData.dischargeLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#84b960",
              weight: 7
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        }); 
    
        data.mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#84b960"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
        });
    
        data.mapData.timelyGapLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
                color:"#fd7e14"
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
        });
    
        const customIcon = L.icon({
          iconUrl: './assets/red-flag.png',
          iconSize: [64, 64], 
          iconAnchor: [10, 64]
        });
    
        const Markerdata = data.mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
          const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
          .addTo(this.map);
          this.customMarkers.push(customMarker);
    
          const label = L.divIcon({
            className: 'label-icon',
            html: `<div>${marker.markerLabel}</div>`,
            iconSize: [64, 64], // Adjusted iconSize if needed
            iconAnchor: [10, 55] // Example adjustment for label position
          });
    
          const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
            .addTo(this.map);
    
            this.customMarkers.push(labelMarker);
        });
    
        if (data.imageData.length > 0) {
          this.markerClusterGroup = (L as any).markerClusterGroup({
            iconCreateFunction: function (cluster:any) {
              var markers = cluster.getAllChildMarkers();
              var html = '<div class="circle"><span class="cluster-content">' + markers.length + '</span></div>';
              return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
          },
          });
          if (!this.imageControl) {
            this.imageControl = (L.control as any).ImageControl({
              position: 'topright',
              markerClusterGroup: this.markerClusterGroup,
            }).addTo(this.map);
          }else{
            this.imageControl.updateMarkerClusterGroup(this.markerClusterGroup);
          }
        } 
        else{
          if (this.imageControl) {
            this.imageControl.remove();
            this.imageControl = null;
          }
        }
    
        if(data.imageData)
        {
            var imagedata = data.imageData.forEach((image :any) =>{
              const cameraType = image.cameraType;
              const imagePath = image.path;
              const timedata = image.time;
              var tooltip = L.tooltip({
                direction:'top',
                permanent:true,
                interactive:true,
                offset:[-15,26],
              })
              .setLatLng([image.gpsLatitude, image.gpsLongitude])
              .setContent(tooltipData(cameraType,imagePath));
              const marker = L.marker([image.gpsLatitude, image.gpsLongitude],{
                opacity:0
              }).bindTooltip(tooltip).openTooltip();
              this.markerClusterGroup.addLayer(marker);
              marker.on('click', (e: any) => {
                this.mapDataService.getImageForMultipleMachine(imagePath).subscribe(
                  data => {
                    const url = URL.createObjectURL(data);
                    this.selectedImage = url;
                    console.log("Image URL: " + this.selectedImage);
                    const { date, time} = this.separateDateTime(timedata);
                    if(cameraType=='unloadingcam'){
                      this.imageContentData = "Unloading conveyor camera picture " + date + ", " + time + " Clock";
                    }else{
                      this.imageContentData = "Front camera recording " + date + ", " + time + " Clock";
                    }
                   },error => {
                    console.error('Error fetching map data', error);
                  });
              });
            });
        }else{
        }       
        
        if (allPolylineCoordinates.length > 0) {
          console.log('enter into the fit bound method');
          const bounds = L.latLngBounds(allPolylineCoordinates);
          this.map.fitBounds(bounds);
          const center = bounds.getCenter();
          if (isNaN(center.lat) || isNaN(center.lng)) {
            console.error('Invalid center coordinates:', center.lat, center.lng);
            return;
          }
          const zoom = this.map.getBoundsZoom(bounds);
          this.homeControl.setCenter(center);
          console.log('Calculated Zoom Level:', zoom);
          this.homeControl.setZoom(zoom);
        }else{
            console.error('No valid polyline coordinates found.');
        }
      },
      error => {
        console.error('Error fetching map data', error);
        this.isLoading = false;
      }
    )
  }

  
  separateDateTime(isoString: string): { date: string, time: string } {
    // Create a Date object from the ISO string
    const dateObj = new Date(isoString);
  
    // Extract the date components
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // months are 0-based
    const day = ('0' + dateObj.getUTCDate()).slice(-2);
  
    // Extract the time components
    const hours = ('0' + dateObj.getUTCHours()).slice(-2);
    const minutes = ('0' + dateObj.getUTCMinutes()).slice(-2);
    const seconds = ('0' + dateObj.getUTCSeconds()).slice(-2);
  
    // Format the date and time strings
    const date = `${year}/${month}/${day}`;
    const time = `${hours}:${minutes}:${seconds}`;
  
    return { date, time };
  }


 

  private toggleLegendAndPaths(color: string) {
    switch (color) {
      case 'yellow':
          this.toggleLegend('.yellow-box small');
          this.togglePaths('harvestingLinePath');
          break;
      case 'red':
          this.toggleLegend('.red-box small');
          this.togglePaths('noHarvestingLinePath');
          break;
      case 'blue':
          this.toggleLegend('.blue-box small');
          this.togglePaths('roadTripLinePath');
          break;
      case 'green':
          this.toggleLegend('.green-box small');
          this.togglePaths('dischargeLinePath');
          break;
      default:
      break;
    }
  }

  private togglePaths(pathType: string) {
    switch (pathType) {
      case 'roadTripLinePath':
          this.togglePolylines('#7acdef');
          break;
      case 'harvestingLinePath':
          this.togglePolylines('#ffd800');
          break;
      case 'noHarvestingLinePath':
          this.togglePolylines('#E37056');
          break;
      case 'dischargeLinePath':
        if(this.extendControl==true){
          this.togglePolylines('#84b960');
        }else{
          this.togglePolylinesForDischarge('#84b960');
        }
          break;
      default:
          break;
    }
  }

  private togglePolylines(color: string) { 
    console.log("color is:"+color) 
    this.polylines.forEach(polyline => {
  const options = polyline.options as L.PolylineOptions;
    if (options.color === color) {
      console.log("match found!");
      if (this.map.hasLayer(polyline)) {
          this.map.removeLayer(polyline);
      } else {
          this.map.addLayer(polyline);
      }
      }else{
        console.log("not match found!");
      }
    });
  }

  private togglePolylinesForDischarge(color: string) {  
    this.polylinesforDischarge.forEach(polyline => {
    const options = polyline.options as L.PolylineOptions;
    if (options.color === color) {
      console.log("match found!");
      if (this.map.hasLayer(polyline)) {
          this.map.removeLayer(polyline);
      } else {
          this.map.addLayer(polyline);
      }
      }else{
        console.log("not match found!");
      }
    });
  }

  private toggleLegend(selector: string) {
  const span = document.querySelector(selector);
  console.log("span is"+span);
  if (span) {
      span.classList.toggle('hidden');
  }
  }


  private initMap(): void {
    const latlng: any =[];
    
    this.map =(L.map as any)('leafletMap',{
        closePopupOnClick:false,
        scrollWheelZoom:'center',
        gestureHandling: true,
        zoomControl: false,
        attributionControl:false,
        maxZoom: 18,
        center: [0, 0], // Default center coordinates
        zoom: 2
    });  

    if(this.showClusterControl)
    {
        this._markers = (L as any).markerClusterGroup({
          iconCreateFunction: function (cluster:any) {
            var markers = cluster.getAllChildMarkers();
            var html = '<div class="clustergroup">' + markers.length + '</div>';
            return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
        },
        });
    }

    this._ZoomControl = L.control.zoom({
        position:"bottomright",
    }).addTo(this.map);

    if(!this.map){
        console.error("Map initialization failed.");
    }

    var googlehybrid = (L.gridLayer as any).googleMutant({
    type: "hybrid", });

    var satMutant = (L.gridLayer as any).googleMutant({
        type: "satellite",
    });

    var terrainMutant = (L.gridLayer as any).googleMutant({
        type: "terrain",
    });

    if (googlehybrid) {
        googlehybrid.addTo(this.map);
    } else {
        console.error("Failed to create terrain layer.");
    }

    if(this.showFullscreenControl==true)
    {
        var fsControl = (L.control as any).fullscreen({
          position:'topright'
        });
        this.map.addControl(fsControl);
    }

    const fixedControl = (L.control as any).fixedView({ position: 'topright' }).addTo(this.map);

    this.homeControl = (L.control as any).defaultExtent({
      title:"automatic zoom",
      position:"topright"
    }).addTo(this.map);
    
    if(this.showClusterControl==true)
    {
      (L.control as any).customControl({ position: 'topright', markers: this._markers }).addTo(this.map);
    }
  
    const baseLayers = {
        "Terrian": terrainMutant,
        "Satellite":googlehybrid
    };

    var overlayMaps = {

    };

    const scaleView = L.control.scale({
      position : 'bottomleft',
      metric:true,
      updateWhenIdle:true
    }).addTo(this.map);

    var layerControl = L.control.layers(baseLayers, overlayMaps,{
      collapsed:false,
      position:'topleft'
    }).addTo(this.map);

    if(this.legends.isLifting)
    {
        var yellowLi = document.querySelector('.component li .yellow-box')?.parentElement as HTMLElement;
        console.log("span"+yellowLi);
        if (yellowLi) {
          yellowLi.addEventListener('click', () => {
              this.toggleLegendAndPaths('yellow');
          });
        }else{
            console.log("yellow li not found!");
        }
    }else{
      var yellowLi = document.querySelector('.component li .yellow-box')?.parentElement as HTMLElement;
      if (yellowLi) {
        yellowLi.classList.add('hidden');
      }
    }

    if(this.legends.isNoLifting)
    {
        var redLi = document.querySelector('.component li .red-box')?.parentElement as HTMLElement;
        if (redLi) {
          redLi.addEventListener('click', () => {
              this.toggleLegendAndPaths('red');
          });
      }
    }else{
      var redLi = document.querySelector('.component li .red-box')?.parentElement as HTMLElement;
      if (redLi) {
        redLi.classList.add('hidden');
      }
    }
    
    if(this.legends.isRoad){
      var blueLi = document.querySelector('.component li .blue-box')?.parentElement as HTMLElement;
      if (blueLi) {
        blueLi.addEventListener('click', () => {
            this.toggleLegendAndPaths('blue');
        });
      }
    }else{
      var blueLi = document.querySelector('.component li .blue-box')?.parentElement as HTMLElement;
      if (blueLi) {
        blueLi.classList.add('hidden');
      }
    }

    if(this.legends.isUnloading){
      var greenLi = document.querySelector('.component li .green-box')?.parentElement as HTMLElement;
      if (greenLi) {
        greenLi.addEventListener('click', () => {
            this.toggleLegendAndPaths('green');
        });
      }
    }else{
      const greenLi = document.querySelector('.component li .green-box')?.parentElement as HTMLElement;
      if (greenLi) {
        greenLi.classList.add('hidden');
      }
    }

    if(this.extendControl!=true)
    {
      var extendView = document.querySelector(".icon-fullscreen");
      if(extendView){
      extendView.classList.add("hidden");
      }
    }
    
     if(this.extendControl==false){
      const mapstyle = document.querySelector("#leafletMap");
      const map = document.querySelector(".mapstyle");
      if(mapstyle){
        mapstyle.classList.add("mapwidth");
        (document.querySelector(".mapstyle") as any).style.width = 95 +"%";
        (document.querySelector(".mapstyle") as any).style.padding = 0+"px";
        (document.querySelector(".mapstyle") as any).style.margin = 'auto';
      }
      if (this.map) { 
        setTimeout(() => {
          this.map.invalidateSize();
        }, 200); 
      }
    }
  }

}

function popupData(value:any): L.Content | ((source: L.Layer) => L.Content) {
    return `<div style='text-align:center;' class='machine-status-holder'> <p style='margin-bottom:2px'>${value}</p> <img src='./assets/TigerOff.png' alt='images mechine' width='70px'> <span class='status'> offline </span></div>`;
}


function tooltipData(cameraType: any,imagepath: any): L.Content | ((source: L.Layer) => L.Content) {
    if(cameraType=='unloadingcam'){
      return `<div class="tooltipImage"><img src='./assets/MapBack.png' title="uploading camera" class="tooltip-image"></div>`;
    }else{
      return `<div class="tooltipImage" title='front camera'><img src='./assets/MapFront.png' class="tooltip-image"></div>`;
    }
}

