import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-motions",
  templateUrl: "frequency.component.html",
  styleUrls: ["frequency.component.scss"]
})
export class FrequencyComponent implements OnInit {
  constructor() {}
  speed1 = 50
  speed2 = 10
  speed3 = 0
  ngOnInit() {}
}
