import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppModule } from './app/app.module';

registerLicense("Mgo+DSMBMAY9C3t2UVhhQlVCfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5SdEdjWnxcdXFSTmZc;MzA1NTU0NkAzMjM0MmUzMDJlMzBia0xwYVU2UGFCRFg1R1BMMlNoWXhoMFR1R3ZQUklaY3FkTDJOSndWZEVzPQ==");
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
