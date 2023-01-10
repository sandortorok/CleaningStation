import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { SettingsComponent } from "../../pages/settings/settings.component";
import { ErrorMessagesComponent } from "src/app/pages/error-messages/error-messages.component";
import { FrequencyComponent } from "src/app/pages/frequency/frequency.component";
import { PressureComponent } from '../../pages/dashboard/pressure/pressure.component';
import { WaterComponent } from "src/app/pages/dashboard/water/water.component";

// import { NotificationsComponent } from "../../pages/notifications/notifications.component";
// import { TypographyComponent } from "../../pages/typography/typography.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { TemperatureComponent } from "src/app/pages/dashboard/temperature/temperature.component";

export const AdminLayoutRoutes: Routes = [
  // { path: "dashboard", component: DashboardComponent },
  { path: "settings", component: SettingsComponent },
  { path: "errors", component: ErrorMessagesComponent },
  { path: "fchanger", component: FrequencyComponent },
  { path: "dashboard/temp", component: TemperatureComponent},
  { path: "dashboard/pressure", component: PressureComponent},
  { path: "dashboard/water", component: WaterComponent},
  // { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  // { path: "rtl", component: RtlComponent }
];
