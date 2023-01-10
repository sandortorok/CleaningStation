import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-motions",
  templateUrl: "pumps.component.html",
  styleUrls: ["pumps.component.scss"]
})
export class PumpsComponent implements OnInit {
  constructor() {}
  speed1 = 50
  speed2 = 10
  speed3 = 0
  ngOnInit() {}
}
