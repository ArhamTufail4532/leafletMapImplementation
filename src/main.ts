import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppModule } from './app/app.module';

registerLicense("ORg4AjUWIQA/Gnt2UFhhQlJBfVhdXGNWfFN0QXNcdV1zflBCcC0sT3RfQFljT39TdkBgXntfcndXRQ==");
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
