import { PressureComponent } from '../../pages/dashboard/pressure/pressure.component';
import { TemperatureComponent } from '../../pages/dashboard/temperature/temperature.component';
import { PumpSVGComponent } from '../../components/pump-svg/pump-svg.component';
import { ToggleButtonComponent } from './../../components/toggle-button/toggle-button.component';
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { SettingsComponent } from "../../pages/settings/settings.component";
import { ErrorMessagesComponent } from "../../pages/error-messages/error-messages.component";
import { LedSwitchComponent } from './../../components/led-switch/led-switch.component';
import { Led50SwitchComponent } from './../../components/led50-switch/led50-switch.component';
import { FrequencyComponent } from "../../pages/frequency/frequency.component";
// import { IconsComponent } from "../../pages/icons/icons.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ThreeWayChartComponent } from 'src/app/components/three-way-chart/three-way-chart.component';
import { PngSVGComponent } from 'src/app/components/png-svg/png-svg.component';
import { XlsSVGComponent } from 'src/app/components/xls-svg/xls-svg.component';
import { WaterComponent } from 'src/app/pages/dashboard/water/water.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbCollapseModule,
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    TemperatureComponent,
    PressureComponent,
    SettingsComponent,
    LedSwitchComponent,
    Led50SwitchComponent,
    ErrorMessagesComponent,
    FrequencyComponent,
    PumpSVGComponent,
    ToggleButtonComponent,
    ThreeWayChartComponent,
    XlsSVGComponent,
    PngSVGComponent,
    WaterComponent,
    // IconsComponent,
    // RtlComponent
  ]
})
export class AdminLayoutModule {}
