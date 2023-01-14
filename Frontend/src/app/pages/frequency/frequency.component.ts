import { WebsocketService } from './../../services/web-socket.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-motions",
  templateUrl: "frequency.component.html",
  styleUrls: ["frequency.component.scss"]
})
export class FrequencyComponent implements OnInit {
  constructor(private wss: WebsocketService) {}
  speed1 = 50
  speed2 = 10
  speed3 = 0
  ngOnInit() {
    this.wss.speedCast.subscribe(speeds=>{
      this.speed1 = speeds.speed1
      this.speed2 = speeds.speed2
      this.speed3 = speeds.speed3
      console.log('speed change')
    })
  }
}
