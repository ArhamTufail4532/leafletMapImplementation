import { Component, OnInit, AfterViewInit, Attribute, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { MapData } from '../interfaces/MapData';
import { MechineDataServiceService } from '../mechine-data-service.service';
import "leaflet.gridlayer.googlemutant";
import "leaflet.fullscreen";
import { RangeEventArgs } from '@syncfusion/ej2-angular-calendars';
import "src/assets/leaflet-gesture-handling.js";
import "src/assets/leaflet-control-defaulthome.js";
import "src/assets/leaflet-control-dummy.js";
import { __metadata } from 'tslib';

interface MachineData {
    machineCalculations: {
        time: string;
    }
  }
  
  interface JsonDataItem {
    machinedata: MachineData;
  }
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
  providers: [MechineDataServiceService]
})

export class LeafletMapComponent implements OnInit, AfterViewInit {
    private polylines: L.Polyline[] = [];
    public _machineData : any;
    _lat : number = 52.096112667;
    _lng : number = 10.562562667;
    _machineName : string = "";
    _polyline : any;
    homeControl : any;
    public selectedDate :any;
  private map: L.Map = {} as L.Map; // Initialize as an empty object
 

constructor(private _singleMechineData: MechineDataServiceService) { }

  ngOnInit(): void {
    this.fetchData();
  }
fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
}
  ngAfterViewInit(): void {
    this.initMap();
  }

  onDateSelected(args: RangeEventArgs): void  {
    let date = args.startDate;
    const year = date?.getFullYear();
    const month = (date ? (date.getMonth() + 1).toString().padStart(2, '0') : '');
    const day = date?.getDate().toString().padStart(2, '0');
    const selectedDate = `${year}-${month}-${day}`
    // const selectedDateString = this.selectedDate.toISOString().split('T')[0];
    this.polylines.forEach(polyline => this.map.removeLayer(polyline));
    this.polylines = [];
    for(var i=0 ;i<=this._machineData.length;i++)
    {
        if (this._machineData[i]?.machineCalculations?.time) {
            const machineDataDateString = this._machineData[i].machineCalculations.time.toString().split('T')[0];
            console.log(machineDataDateString);
            console.log(selectedDate);
            if (selectedDate == machineDataDateString) {
                console.log('Match found at index:', i);
                this.loadMap(i);
                break;
            }else{
                console.log("match not found!");
            }
        }
    }
  }

  private loadMap(i: number){  //i is index
    let allPolylineCoordinates: [number, number][] = [];
    //this._lat=this._machineData[i].mapData.roadTripLinePath[0].coordinates[0].lat;
    //this._lng=this._machineData[i].mapData.roadTripLinePath[0].coordinates[0].lng;
    //console.log(this._lat + " " + this._lng);
    this._machineData[i].mapData.roadTripLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"skyblue"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.harvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"yellow"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.notHarvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
            color:"red"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.dischargeLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"skyblue"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"red"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.timelyGapLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"red"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    
    if (allPolylineCoordinates.length > 0) {
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
}
  private initMap(): void {

    
    const latlng: any =[];
    // let allPolylineCoordinates: [number, number][] = [];
    this.map =new (L.Map as any)('leafletMap',{
        closePopupOnClick:false,
        scrollWheelZoom:'center',
        gestureHandling: true,
        zoomControl: false,
        attributionControl:false
    }).setView([this._lat, this._lng], 13);

    L.popup({
        offset:[1,6],
        keepInView:false,
        autoClose:false
    })
    .setLatLng([this._lat, this._lng])
    .setContent(popupData(this._machineName[0]))
    .openOn(this.map); 

    L.control.zoom({
        position:"bottomright",
    }).addTo(this.map);


    if(!this.map){
        console.error("Map initialization failed.");
    }

    //google map initilization througth the 
    var googlehybrid = (L.gridLayer as any).googleMutant({
    type: "hybrid", });

    var satMutant = (L.gridLayer as any).googleMutant({
        type: "satellite",
    });

    var terrainMutant = (L.gridLayer as any).googleMutant({
        type: "terrain",
    });

    if (terrainMutant) {
        terrainMutant.addTo(this.map);
    } else {
        console.error("Failed to create terrain layer.");
    }

    if (!this.map.hasLayer(terrainMutant)) {
        console.error("Terrain layer was not added to the map.");
    }

    // full screen view control implementation
    var fsControl = (L.control as any).fullscreen({
        position:'topright'
    });
    this.map.addControl(fsControl);

    (L.control as any).fixedView({ position: 'topright' }).addTo(this.map);
    //automatic zoom 
    this.homeControl = (L.control as any).defaultExtent({
        title:"automatic zoom",
        position:"topright"
    }).setCenter([this._lat,this._lng])
  .addTo(this.map);

        const baseLayers = {
            "satellite":googlehybrid,
            "terrian": terrainMutant,
        };

    // scale on map implementation
    L.control.scale({
        position : 'bottomleft',
        metric:true,
        updateWhenIdle:true
    }).addTo(this.map);

    //single Marker on map Implementaion

    //popup for mechine data 
    

    this.map.on('enterFullscreen', function(){
        if(window.console) window.console.log('enterFullscreen');
    });
    this.map.on('exitFullscreen', function(){
        if(window.console) window.console.log('exitFullscreen');
    });
    
    var overlays = {
        
    };

    // other leaflet map controller
    var layerControl = L.control.layers(baseLayers, overlays,{
        collapsed : false,
        autoZIndex: true,
        position:'topleft'
    }).addTo(this.map); 

}

  private addPolyline(coordinates: any[], color: string): void {
    const polyline = L.polyline(coordinates, { color: color }).addTo(this.map);
  }

  private addCircleMarker(coordinates: any[], color: string): void {
    coordinates.forEach(coord => {
      L.circleMarker([coord.lat, coord.lng], { color: color, radius: 4 }).addTo(this.map);
    });
  }

}

//machine data styling on map
function popupData(value:any): L.Content | ((source: L.Layer) => L.Content) {
    return `<div style='text-align:center;' class='machine-status-holder'> <p style='margin-bottom:2px'>${value}</p> <img src='./assets/TigerOff.png' alt='images mechine' width='70px'> <span class='status'> offline </span></div>`;
}



