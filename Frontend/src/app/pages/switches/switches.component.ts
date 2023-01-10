import { HttpService } from './../../services/http.service';
import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-switches",
  templateUrl: "switches.component.html",
  styleUrls: ["./switches.component.scss"]
})
export class SwitchesComponent implements OnInit {
  constructor() {}
  zones: Zone[]
  is_50:Boolean = false;
  ngOnInit() {
  }
}
