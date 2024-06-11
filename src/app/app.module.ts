import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DateRangePickerModule, CalendarModule, DatePickerModule, TimePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DateRangePickerModule,
    CalendarModule, DatePickerModule, TimePickerModule, DateTimePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
