import { Component, OnInit, AfterViewInit, Attribute, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { MapData } from '../interfaces/MapData';
import { MechineDataServiceService } from '../mechine-data-service.service';
import { MultipleMachineDataService } from '../multiple-machine-data.service';
import { MultipleMechineLinePathService } from '../multiple-mechine-line-path.service';
import "leaflet.gridlayer.googlemutant";
import "leaflet.fullscreen";
import { RangeEventArgs } from '@syncfusion/ej2-angular-calendars';
import "src/assets/leaflet-gesture-handling.js";
import "src/assets/leaflet-control-defaulthome.js";
import "src/assets/leaflet-control-FixedView.js";
import "leaflet.markercluster";
import { __metadata } from 'tslib';
import "src/assets/leaflet-control-markers.js";
import { Coordinate } from '../interfaces/Coordinate';

interface MachineData {
    machineCalculations: {
        time: string;
    }
  }

  interface Path {
    coordinates: Coordinate[];
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
    private _markers : any;    
    _lat : number = 52.096112667;
    _lng : number = 10.562562667;
    _machineName : string = "";
    _polyline : any;
    homeControl : any;
    jsonData : any;
    public selectedDate :any;
    private polylinesLayer: any;
    private polygonsLayer: any;
  private map: L.Map = {} as L.Map; // Initialize as an empty object
 

constructor(private _singleMechineData: MechineDataServiceService, private _multipleMechineData:MultipleMachineDataService, private _multipleMachineLinePath:MultipleMechineLinePathService) { }

  ngOnInit(): void {
    this.fetchData();
  }
fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
}
  ngAfterViewInit(): void {
    this.initMap();
    this.loadMarker();
    //this.loadLineAndPolygon();
    this.fitMapToBounds();
  }

  /*private loadLineAndPolygon(){
    var polylinedto = this._multipleMachineLinePath.getAllMechineLinePath().machinePolylineDto.roadTripLinePath;
    var polygondto = this._multipleMachineLinePath.getAllMechineLinePath().machinePolylineDto.harvestingPolygonPath;
    polylinedto.forEach(path => {
        const latLngs = path.coordinates.map(coord => L.latLng(coord.lat, coord.lng));
        this.addPolylineToMap(latLngs);
      });

      polygondto.forEach(path => {
        const latLngs = path.coordinates.map(coord => [coord.lat, coord.lng]);
        this.addPolygonToMap(latLngs);
      });
  }

  private addPolylineToMap(latLngs: L.LatLng[]): void {
    const polyline = L.polyline(latLngs, { color: '#7acdef', weight: 4, opacity: 0.7 });
    this.polylinesLayer.addLayer(polyline);
  }

  private addPolygonToMap(latLngs: any[]): void {
    const polygon = L.polygon(latLngs, { color: 'yellow', fillColor: 'red', weight: 2, opacity: 0.7 });
    this.polygonsLayer.addLayer(polygon);
  } */
  private loadMarker(): void {
    const mapInfoWindow = this._multipleMechineData.getMultipleMechineData().mapInfoWindowDto.harvestingMapInfoWindows;

    mapInfoWindow.forEach(infoWindow => {
        const{ lat , lng } = infoWindow.mapInfoWindowCoordinate;
        var marker = L.marker([lat, lng],{ opacity: 0, zIndexOffset: -1000 });
        this._markers.addLayer(marker);
    });
    this.map.addLayer(this._markers);
  }

  private fitMapToBounds(): void {
    const mapInfoWindows = this._multipleMechineData.getMultipleMechineData().mapInfoWindowDto.harvestingMapInfoWindows;
    const latLngs: L.LatLngExpression[] = mapInfoWindows.map(infoWindow => {
      return [infoWindow.mapInfoWindowCoordinate.lat, infoWindow.mapInfoWindowCoordinate.lng];
    });

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      this.map.fitBounds(bounds);
      const center = bounds.getCenter();
      const zoom = this.map.getBoundsZoom(bounds);
        this.homeControl.setCenter(center);
        console.log('Calculated Zoom Level:', zoom);
        this.homeControl.setZoom(zoom);
    }
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
            color:"#7aceef"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.harvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#ffc107"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.notHarvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
            color:"#fd7e14"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.dischargeLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#7aceef"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#84b960"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.timelyGapLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#fd7e14"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    /* this._machineData[i].forEach(data => {
      const harvestingMarkers = data.mapMarkers.harvestingMapMarkers;
      harvestingMarkers.forEach(marker => {
        L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng])
          .addTo(this.map)
          .bindPopup(marker.markerLabel);
      });
    }); */

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<img alt="" src="./assets/red-flag.png" draggable="false" style="width: 66px; height: 62px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;">`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });


    const data = this._machineData[i].mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
      L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
      .addTo(this.map);
      const label = L.divIcon({
        className: 'label-icon',
        html: `<div>${marker.markerLabel}</div>`,
        iconSize: [30, 0]
      });

      L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
        .addTo(this.map);
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
        attributionControl:false,
        maxZoom: 18
    }).setView([this._lat, this._lng], 4);

    this.polylinesLayer = L.layerGroup().addTo(this.map);
    this.polygonsLayer = L.layerGroup().addTo(this.map);
    this._markers = (L as any).markerClusterGroup({
    });

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

  (L.control as any).customControl({ position: 'topright', markers: this._markers }).addTo(this.map);

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



function getRandomLatLng(map: L.Map): L.LatLngExpression {
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var lngSpan = northEast.lng - southWest.lng;
    var latSpan = northEast.lat - southWest.lat;
    return new L.LatLng(
      southWest.lat + (latSpan * Math.random()),
      southWest.lng + (lngSpan * Math.random())
    );
}

