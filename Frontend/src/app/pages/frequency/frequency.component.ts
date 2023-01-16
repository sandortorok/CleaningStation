import { HttpService } from 'src/app/services/http.service';
import { WebsocketService } from './../../services/web-socket.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-motions",
  templateUrl: "frequency.component.html",
  styleUrls: ["frequency.component.scss"]
})
export class FrequencyComponent implements OnInit {
  constructor(private wss: WebsocketService, private http: HttpService) {}
  speed1 = 50
  speed2 = 10
  speed3 = 0
  auto:Boolean;
  running:Boolean;
  waterOn:Boolean;
  wIn: Number;
  wOut: Number;
  wGoal: Number;
  ngOnInit() {
    this.wss.dInputCast.subscribe(res=>{
      let result = Object.values(res)
      result.forEach(di=>{
        if(di.name === 'Water_on'){
          this.waterOn = di.is_on
        }
        else if(di.name === 'Auto'){
          this.auto = di.is_on
        }
      })
    })
    this.wss.aInputCast.subscribe(res=>{
      let result = Object.values(res)
      result.forEach(ai=>{
        if(ai.name === 'wIn'){
          this.wIn = ai.value
        }
        else if(ai.name === 'wOut'){
          this.wOut = ai.value
        }
        else if(ai.name === 'wGoal'){
          this.wGoal = ai.value
        }
      })
    })
    this.wss.dOutputCast.subscribe(res=>{
      let result = Object.values(res)
      result.forEach((dout)=>{
        if(dout.name === 'Running'){
          this.running = dout.is_on
        }
      })
    })
    this.wss.speedCast.subscribe(speeds=>{
      this.speed1 = speeds.speed1
      this.speed2 = speeds.speed2
      this.speed3 = speeds.speed3
      console.log('speed change')
    })
  }
}
