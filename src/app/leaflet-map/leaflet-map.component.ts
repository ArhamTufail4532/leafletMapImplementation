import { Component, OnInit, AfterViewInit, Attribute, HostListener, Input } from '@angular/core';
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
import { Lagends } from '../Models/Lagends.model';

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

  @Input() showZoomControl: boolean = true;
  @Input() showFullscreenControl: boolean = true;
  @Input() showScaleControl: boolean = true;
  @Input() showClusterControl: boolean = true;
  @Input() legends: Lagends = new Lagends();

    private polylines: L.Polyline[] = [];
    private customMarkers : L.Marker[] = [];
    public _machineData : any;
    private _markers : any;    
    _lat : number = 52.096112667;
    _lng : number = 10.562562667;
    _machineName : string = "";
    _polyline : any;
    homeControl : any;
    jsonData : any;
    _ZoomControl : any;
    public selectedDate :any;
    private polylinesLayer: any;
    private polygonsLayer: any;
    private map: L.Map = {} as L.Map; // Initialize as an empty object
 

constructor(private _singleMechineData: MechineDataServiceService, private _multipleMechineData:MultipleMachineDataService, private _multipleMachineLinePath:MultipleMechineLinePathService) { 
  
}

  ngOnInit(): void {
    this.fetchData();
    if(this.map){
      this.map.off();
      this.map.remove();
      console.log("map remove");
    }
  }
fetchData():void{
    this._machineData = this._singleMechineData.getMechineData();
}
  ngAfterViewInit(): void {
    this.initMap();
    if(this.showClusterControl)
    {
        this.loadMarker();
    }
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
    this.customMarkers.forEach(marker => {
      if (this.map.hasLayer(marker)) {
        this.map.removeLayer(marker);
      }
    });
    this.customMarkers = [];
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

    /*var yellowLi = document.querySelector('.component li .yellow-box')?.parentElement as HTMLElement;
    var redLi = document.querySelector('.component li .red-box')?.parentElement as HTMLElement;
    var blueLi = document.querySelector('.component li .blue-box')?.parentElement as HTMLElement;
    var greenLi = document.querySelector('.component li .green-box')?.parentElement as HTMLElement;

    if (yellowLi) {
      yellowLi.addEventListener('click', () => {
          this.toggleLegendAndPaths('yellow');
      });
    }else{
        console.log("yellow li not found!");
    }
  if (redLi) {
      redLi.addEventListener('click', () => {
          this.toggleLegendAndPaths('red');
      });
  }
  if (blueLi) {
      blueLi.addEventListener('click', () => {
          this.toggleLegendAndPaths('blue');
      });
  }
  if (greenLi) {
      greenLi.addEventListener('click', () => {
          this.toggleLegendAndPaths('green');
      });
  }*/

    this._machineData[i].mapData.roadTripLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#7acdef" 
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.harvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#ffd800"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.notHarvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
            color:"#E37056"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[i].mapData.dischargeLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#84b960"
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
      const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
      .addTo(this.map);
      this.customMarkers.push(customMarker);
      const label = L.divIcon({
        className: 'label-icon',
        html: `<div>${marker.markerLabel}</div>`,
        iconSize: [30, 0]
      });

      const labelMarker  = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng], { icon: label })
        .addTo(this.map);

        this.customMarkers.push(labelMarker);
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


private toggleLegendAndPaths(color: string) {
  switch (color) {
      case 'yellow':
          // Toggle visibility of yellow legend and associated paths
          this.toggleLegend('.yellow-box small');
          this.togglePaths('harvestingLinePath');
          break;
      case 'red':
          // Toggle visibility of red legend and associated paths
          this.toggleLegend('.red-box small');
          this.togglePaths('noHarvestingLinePath');
          break;
      case 'blue':
          // Toggle visibility of blue legend and associated paths
          this.toggleLegend('.blue-box small');
          this.togglePaths('roadTripLinePath');
          break;
      case 'green':
          // Toggle visibility of green legend and associated paths
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
          this.togglePolylines('#84b960');
          break;
      // Add cases for other path types as needed
      default:
          break;
  }
}

private togglePolylines(color: string) {
  // Toggle visibility of polylines based on color
  console.log(color);
  this.polylines.forEach(polyline => {
      const options = polyline.options as L.PolylineOptions;
      if (options.color === color) {
        console.log("match found!");
          if (this.map.hasLayer(polyline)) {
              this.map.removeLayer(polyline);
          } else {
              this.map.addLayer(polyline);
          }
      }
  });
}

private toggleLegend(selector: string) {
  const span = document.querySelector(selector);
  console.log(span);
  if (span) {
      span.classList.toggle('hidden');
      console.log("class added succfully!");
  }
}
  private initMap(): void {
    const latlng: any =[];
    // let allPolylineCoordinates: [number, number][] = [];
    
    this.map =(L.map as any)('leafletMap',{
        closePopupOnClick:false,
        scrollWheelZoom:'center',
        gestureHandling: true,
        zoomControl: false,
        attributionControl:false,
        maxZoom: 18
    }).setView([this._lat, this._lng], 4);

    this.polylinesLayer = L.layerGroup().addTo(this.map);
    this.polygonsLayer = L.layerGroup().addTo(this.map);

    if(this.showClusterControl)
    {
        this._markers = (L as any).markerClusterGroup({
        });
    }

    L.popup({
        offset:[1,6],
        keepInView:false,
        autoClose:false
    })
    .setLatLng([this._lat, this._lng])
    .setContent(popupData(this._machineName[0]))
    .openOn(this.map); 

    this._ZoomControl = L.control.zoom({
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

    if (googlehybrid) {
        googlehybrid.addTo(this.map);
    } else {
        console.error("Failed to create terrain layer.");
    }

    // full screen view control implementation
    if(this.showFullscreenControl==true)
      {
        var fsControl = (L.control as any).fullscreen({
          position:'topright'
        });
        this.map.addControl(fsControl);
      }
    (L.control as any).fixedView({ position: 'topright' }).addTo(this.map);
    //automatic zoom 
    this.homeControl = (L.control as any).defaultExtent({
        title:"automatic zoom",
        position:"topright"
    }).setCenter([this._lat,this._lng])
  .addTo(this.map);

  if(this.showClusterControl==true)
    {
      (L.control as any).customControl({ position: 'topright', markers: this._markers }).addTo(this.map);
    }
  

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

    if(this.legends.isLifting)
    {
        var yellowLi = document.querySelector('.component li .yellow-box')?.parentElement as HTMLElement;
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
    
    console.log("on leaflet map"+this.legends.isRoad);
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

