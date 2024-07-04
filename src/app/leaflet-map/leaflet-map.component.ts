import { Component, OnInit, AfterViewInit, Attribute, HostListener, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-groupedlayercontrol';
import { MultipleMechineLinePathService } from '../multiple-mechine-line-path.service';
import { MachineDataService } from '../machine-data.service';
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
import { ViewContainerRef } from '@angular/core';
import {Router} from "@angular/router"
import { RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';

interface MachineData {
    machineCalculations: {
        time: string;
    }
  }

  var date = [
    {
      "startDate":"2023-10-10",
      "endDate":"2023-10-19"
    }
  ]

  

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
    public today: Date = new Date();
    public currentYear: number = this.today.getFullYear();
    public currentMonth: number = this.today.getMonth();
    public currentDay: number = this.today.getDate();
    public minDate: Object = {};
    public maxDate: Object =  {};
    private polylines: L.Polyline[] = [];
    private customMarkers : L.Marker[] = [];
    public _machineData : any;
    private _markers : any;    
    _lat : number = 52.096112667;
    _lng : number = 10.562562667;
    _machineName : string = "";
    _polyline : any;
    public _multipleDatesData : any;
    homeControl : any;
    jsonData : any;
    machineobject: any;
    index : any;
    _ZoomControl : any;
    public selectedDate :any;
    private polylinesLayer: any;
    private polygonsLayer: any;
    private map: L.Map = {} as L.Map;
    _jsonData = {
      enabledDates: ['2024-07-04', '2024-07-06', '2024-07-10']
    };
    enabledDates: string[] = [];
    public dateValue: Date = new Date()
    public minDates: Date = new Date('2022-07-01');
    public maxDates: Date = new Date('2024-07-31'); // Initialize as an empty object

constructor(private _singleMechineData: MachineDataService, private _multipleMachineLinePath:MultipleMechineLinePathService,private router:Router) { 
  
}



  ngOnInit(): void {
    for(var i=0;i<date.length;i++){
      this.minDate = date[i].startDate;
      this.maxDate = date[i].endDate;
    }
    console.log("minDate"+this.minDate);
    console.log("maxDate"+this.maxDate);
    this.fetchData();
    this.initializeEnabledDates();
    if(this.map){
      this.map.off();
      this.map.remove();
      console.log("map remove");
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
    if(this.showClusterControl)
    {
        this.loadMarker();
        this.loadMultipleMachineMapDataOnMap();
    }
    this.fitMapToBounds();
  }
  private loadMultipleMachineMapDataOnMap(){
    let allPolylineCoordinates: [number, number][] = [];
      this._singleMechineData.getMultipleMachineMapdata().machinePolylineDto.roadTripLinePath.forEach((line)=>{
        const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
        const polyline = L.polyline(coordinates as any,{
          color:"#7acdef" 
        }).addTo(this.map);
      this.polylines.push(polyline);
      allPolylineCoordinates.push(coordinates as any);
      });
      this._singleMechineData.getMultipleMachineMapdata().machinePolylineDto.notHarvestingLinePath.forEach((line)=>{
        const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
        const polyline = L.polyline(coordinates as any,{
          color:"#E37056" 
        }).addTo(this.map);
      this.polylines.push(polyline);
      allPolylineCoordinates.push(coordinates as any);
      });
       this._singleMechineData.getMultipleMachineMapdata().machinePolylineDto.harvestingPolygonPath.forEach((line)=>{
        const coordinates = line.coordinates.map((coord) => [coord.lat, coord.lng]);
        const polygon = (L.polygon as any)(coordinates as any,{
          color:"#ffd800",
          fillColor:"#ffd800",
          fillOpacity: 1
      }).addTo(this.map);
      this.polylines.push(polygon);
        allPolylineCoordinates.push(coordinates as any);
      }); 

    } 
  
    private loadMarker(): void {
      const mapInfoWindow = this._singleMechineData.getMultipleMachineMapdata().mapInfoWindowDto.harvestingMapInfoWindows;
      mapInfoWindow.forEach(infoWindow => {
          const{ lat , lng } = infoWindow.mapInfoWindowCoordinate;
          var tooltip = L.tooltip({
            direction:'top',
            permanent:true,
            offset:[-15,26],
          })
        .setLatLng([lat, lng])
        .setContent(popupData(infoWindow.infoWindowContent));
  
          var marker = L.marker([lat, lng],{
            opacity:0
          });
          marker.bindTooltip(tooltip);
  
          marker.openTooltip();
          this._markers.addLayer(marker);
      });
  
      this._markers.openTooltip();
          this.map.addLayer(this._markers);
          this._markers.on('clustermouseover',function(e: any){
            var clusterTooltip = L.tooltip({
              direction: 'top',
              offset: [0, 0],
              className: 'custom-cluster-tooltip'
          }).setContent('');
  
          const cluster = e.layer;
          const childMarkers = cluster.getAllChildMarkers();
  
          // Customize the content of the tooltip based on child markers
          let tooltipContent = '<div>';
          childMarkers.forEach((marker: { getTooltip: () => { (): any; new(): any; getContent: { (): any; new(): any; }; }; }) => {
            var content = marker.getTooltip().getContent();
            const parser = new DOMParser();
              const doc = parser.parseFromString(content, 'text/html') as any;
              const machineName = doc.querySelector('p').textContent;
              tooltipContent += `<p>${machineName}</p>`;
          });
          tooltipContent += '</div>';
  
          clusterTooltip.setLatLng(e.latlng).setContent(tooltipContent);
          cluster.bindTooltip(clusterTooltip).openTooltip();
          });
          
          this._markers.on('click',function(e:any){
            alert("marks click");
          });
          
    }
  

    onRenderDayCell(args: RenderDayCellEventArgs): void {
      const date = args.date;
      if(date){
        const dateString = date.toISOString().split('T')[0];
        const isEnabled = this.enabledDates.includes(dateString);
        if (!isEnabled) {
          args.isDisabled = true;
        }
      }
    }

    private fitMapToBounds(): void {
    const mapInfoWindows = this._singleMechineData.getAllMechineForClusters().mapInfoWindows.harvestingMapInfoWindows;
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



  onDateSelected(args: any): void {
    let selectedDate = args.value;

    if (!selectedDate) {
        console.error("No date selected");
        return;
    }

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const selectedDay = selectedDate.getDate().toString().padStart(2, '0');
    const selectedDateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    this.polylines.forEach(polyline => this.map.removeLayer(polyline));
    this.polylines = [];
    this.customMarkers.forEach(marker => {
        if (this.map.hasLayer(marker)) {
            this.map.removeLayer(marker);
        }
    });
    this.customMarkers = [];
    for (let i = 0; i < this._machineData.length; i++) {
        let date = new Date(this._machineData[i]?.machineCalculations?.time);
        if (this._machineData[i]?.machineCalculations?.time) {
            const machineDataDateString = this._machineData[i].machineCalculations.time.toString().split('T')[0];
            this.enabledDates.push(machineDataDateString);
            console.log("Backend date: " + machineDataDateString);
            if (selectedDateString == machineDataDateString) {
                console.log('Match found at index:', i);
                this._singleMechineData.setIndex(i);
                this.loadMap(i);
                break;
            } else {
                console.log("Match not found!");
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
            color:"#84b960",
            weight: 7
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    }); 

    if(this.legends.isUnloading==true)
      {
        this._machineData[i].mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
          const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
          const polyline = L.polyline(coordinates as any,{
              color:"#84b960"
          }).addTo(this.map);
          this.polylines.push(polyline);
          allPolylineCoordinates.push(coordinates as any);
      });
    }
      

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

    const customIcon = L.icon({
      iconUrl: './assets/red-flag.png',
      iconSize: [64, 64], // Size of your icon
      iconAnchor: [10, 64] // Adjusted to move the icon up by 64 pixels
  });


    const data = this._machineData[i].mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
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
      console.log(options.color);
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
    }).setView([this._lat, this._lng], 4);

    

    if(this._singleMechineData.getIndex()==-1)
      {
        if(this.legends.isUnloading==false && this.showClusterControl==false){

          let allPolylineCoordinates: [number, number][] = [];
    
          this._multipleDatesData[0].mapData.roadTripLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
                color:"#7acdef" 
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
          });
          this._multipleDatesData[0].mapData.notHarvestingLinePath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = (L.polyline as any)(coordinates as any,{
                color:"#E37056" 
            }).addTo(this.map);
            this.polylines.push(polyline);
            allPolylineCoordinates.push(coordinates as any);
          });
    
          this._multipleDatesData[0].mapData.harvestingPolygonPath.forEach((line:Line) =>{
            const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polygon = (L.polygon as any)(coordinates as any,{
                color:"#ffd800" 
            }).addTo(this.map);
            this.polylines.push(polygon);
            allPolylineCoordinates.push(coordinates as any);
          });
    
          const customIcon = L.icon({
            iconUrl: './assets/red-flag.png',
            iconSize: [64, 64], // Size of your icon
            iconAnchor: [10, 64] // Adjusted to move the icon up by 64 pixels
        });
          const data = this._multipleDatesData[0].mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
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
    
            // Optionally adjust the center and zoom level
            const center = bounds.getCenter();
            const zoomLevel = this.map.getBoundsZoom(bounds);
    
            // Set the view with a slight delay to ensure the map has finished adjusting from fitBounds
            setTimeout(() => {
                this.map.setView(center, zoomLevel);
                this.homeControl.setCenter(center);
                this.homeControl.setZoom(zoomLevel);
            }, 200);    
        }
        
      }
      }else{

        

        if(this.showClusterControl==false){
          let allPolylineCoordinates: [number, number][] = [];
          this._machineData[this._singleMechineData.getIndex()].mapData.roadTripLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                  color:"#7acdef" 
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
          });
      
          this._machineData[this._singleMechineData.getIndex()].mapData.harvestingLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                  color:"#ffd800"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
          });
      
          this._machineData[this._singleMechineData.getIndex()].mapData.notHarvestingLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                  color:"#E37056"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
          });
      
          this.map.on("zoomend",()=>{
            var zoomlevel = this.map.getZoom();
            if(zoomlevel == 16)
              {
                this._machineData[this._singleMechineData.getIndex()].mapData.dischargeLinePath.forEach((line:Line) =>{
                  const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                      color:"#84b960"
                  }).addTo(this.map);
                  this.polylines.push(polyline);
                  allPolylineCoordinates.push(coordinates as any);
              });
          
              this._machineData[this._singleMechineData.getIndex()].mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
                  const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
                  const polyline = L.polyline(coordinates as any,{
                      color:"#84b960"
                  }).addTo(this.map);
                  this.polylines.push(polyline);
                  allPolylineCoordinates.push(coordinates as any);
              });
            }
          });
            
          
          
      
          this._machineData[this._singleMechineData.getIndex()].mapData.timelyGapLinePath.forEach((line:Line) =>{
              const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
              const polyline = L.polyline(coordinates as any,{
                  color:"#fd7e14"
              }).addTo(this.map);
              this.polylines.push(polyline);
              allPolylineCoordinates.push(coordinates as any);
          });
      
          const customIcon = L.icon({
            iconUrl: './assets/red-flag.png',
            iconSize: [64, 64], // Size of your icon
            iconAnchor: [10, 64] // Adjusted to move the icon up by 64 pixels
        });
      
      
          const data = this._machineData[this._singleMechineData.getIndex()].mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
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
    
            // Optionally adjust the center and zoom level
            const center = bounds.getCenter();
            const zoomLevel = this.map.getBoundsZoom(bounds);
    
            // Set the view with a slight delay to ensure the map has finished adjusting from fitBounds
            setTimeout(() => {
                this.map.setView(center, zoomLevel);
                this.homeControl.setCenter(center);
                this.homeControl.setZoom(zoomLevel);
            }, 200);    
        }else{
              console.error('No valid polyline coordinates found.');
          }
        }

       
      }
      

    //this.polylinesLayer = L.layerGroup().addTo(this.map);
    //this.polygonsLayer = L.layerGroup().addTo(this.map);

    if(this.showClusterControl)
    {
        this._markers = (L as any).markerClusterGroup({
        });
    }

    if(this.legends.isUnloading!=false){
      L.popup({
        offset:[1,6],
        keepInView:false,
        autoClose:false
    })
    .setLatLng([this._lat, this._lng])
    .setContent(popupData(this._machineData[0].machineCalculations.machine))
    .openOn(this.map);  
    }

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
            "Terrian": terrainMutant,
            "Satellite":googlehybrid
        };

    // scale on map implementation
    L.control.scale({
        position : 'bottomleft',
        metric:true,
        updateWhenIdle:true
    }).addTo(this.map);

    const groupedOverlays = {};

    const options = {
      exclusiveGroups: [],
      groupCheckboxes: true,
      collapsed : false,
      position : "topleft"
    };

    var overlays = {
        
    };

    (L.control as any).groupedLayers(baseLayers, groupedOverlays, options).addTo(this.map);

    this.map.on('enterFullscreen', function(){
        if(window.console) window.console.log('enterFullscreen');
    });
    this.map.on('exitFullscreen', function(){
        if(window.console) window.console.log('exitFullscreen');
    });

    this.map.on('zoomend',()=>{
      var zoomlevel = this.map.getZoom();
      console.log(zoomlevel);
      if(zoomlevel === 16){
        this.legends.isUnloading = true;
      }
    });
    
    // other leaflet map controller
    /* var layerControl = L.control.layers(baseLayers, overlays,{
        collapsed : false,
        autoZIndex: true,
        position:'topleft'
    }).addTo(this.map);  */

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
  if(this.extendControl!=true)
  {
    var extendView = document.querySelector(".icon-fullscreen");
    if(extendView){
      extendView.classList.add("hidden");
    }
  }
  if(this.legends.isUnloading!=true){
    const mapstyle = document.querySelector("#leafletMap");
    const map = document.querySelector(".mapstyle");
    if(mapstyle){
      mapstyle.classList.add("mapwidth");
      (document.querySelector(".mapstyle") as any).style.width = 100+"%";
      (document.querySelector(".mapstyle") as any).style.padding = 0+"px";
    }
    if (this.map) { 
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200); 
    }

  }else{

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

      

    this._machineData[this._singleMechineData.getIndex()].mapData.roadTripLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#7acdef" 
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[this._singleMechineData.getIndex()].mapData.harvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#ffd800"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[this._singleMechineData.getIndex()].mapData.notHarvestingLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
            const polyline = L.polyline(coordinates as any,{
            color:"#E37056"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[this._singleMechineData.getIndex()].mapData.dischargeLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#84b960"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[this._singleMechineData.getIndex()].mapData.dischargeWithoutCircleLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#84b960"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    this._machineData[this._singleMechineData.getIndex()].mapData.timelyGapLinePath.forEach((line:Line) =>{
        const coordinates = line.coordinates.map(coord => [coord.lat,coord.lng]);
        const polyline = L.polyline(coordinates as any,{
            color:"#fd7e14"
        }).addTo(this.map);
        this.polylines.push(polyline);
        allPolylineCoordinates.push(coordinates as any);
    });

    const customIcon = L.icon({
      iconUrl: './assets/red-flag.png',
      iconSize: [64, 64], // Size of your icon
      iconAnchor: [10, 64] // Adjusted to move the icon up by 64 pixels
  });


    const data = this._machineData[this._singleMechineData.getIndex()].mapMarkers.harvestingMapMarkers.forEach((marker: { mapMarkerCoordinate: { lat: number; lng: number; }; markerLabel: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) =>{
      const customMarker = L.marker([marker.mapMarkerCoordinate.lat, marker.mapMarkerCoordinate.lng],{ icon: customIcon })
      .addTo(this.map);
      this.customMarkers.push(customMarker);


      const label = L.divIcon({
        className: 'label-icon',
        html: `<div>${marker.markerLabel}</div>`,
        iconSize: [64, 64], // Adjusted iconSize if needed
        iconAnchor: [12, 50] // Example adjustment for label position
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
/*   const extendButton = document.querySelector(".icon-fullscreen");
  const mapstyle = document.querySelector(".mapstyle");
  extendButton?.addEventListener("click",()=>{
      //(mapstyle as any).style.width = 100+"%";
      //(extendButton as any).style.display = "none";
      
      if (this.map) { 
        setTimeout(() => {
          this.map.invalidateSize();
        }, 200); 
      }
  });  */


  
  
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


