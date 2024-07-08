import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DateRangePickerModule, CalendarModule, DatePickerModule, TimePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppRoutingModule } from './app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SingleMachineViewComponent } from './single-machine-view/single-machine-view.component';
import { SingleMachineViewExtendComponent } from './single-machine-view-extend/single-machine-view-extend.component';
import { MapViewComponent } from './map-view/map-view.component';
import { LeafletDashboardComponent } from './leaflet-dashboard/leaflet-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    SingleMachineViewComponent,
    SingleMachineViewExtendComponent,
    MapViewComponent,
    LeafletDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DateRangePickerModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    CalendarModule, DatePickerModule, TimePickerModule, DateTimePickerModule, BrowserAnimationsModule,MatButtonModule,FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
