import { EventEmitter, Injectable, Output } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import {
  aInput,
  dInput,
  dOutput,
} from "../pages/input-output/input-output.component";

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  @Output() wsMessage = new EventEmitter();
  private speed$ = new BehaviorSubject<{
    speed1: number;
    speed2: number;
    speed3: number;
  }>({ speed1: -1, speed2: -1, speed3: -1 });
  speedCast = this.speed$.asObservable();
  private dInput$ = new BehaviorSubject<dInput[]>([]);
  dInputCast = this.dInput$.asObservable();
  private aInput$ = new BehaviorSubject<aInput[]>([]);
  aInputCast = this.aInput$.asObservable();
  private dOutput$ = new BehaviorSubject<dOutput[]>([]);
  dOutputCast = this.dOutput$.asObservable();
  // webSocket: WebSocket = new WebSocket('ws://10.100.0.233:3000/');
<<<<<<< HEAD
  webSocket: WebSocket = new WebSocket("ws://192.168.15.=======
  webSocket: WebSocket = new WebSocket("ws://192.168.0.15:3000/");
>>>>>>> 22d895c98be705fae658c22a3f697ac6188752f5
  // webSocket: WebSocket = new WebSocket("ws://localhost:3000/");

  constructor() {
    this.openWebSocket();
  }

  openWebSocket() {
    this.webSocket.onopen = (event) => {
      console.log({ Websocket: "OPEN" });
    };

    this.webSocket.onmessage = (event) => {
      this.webSocket.addEventListener;
      if (this.isJsonString(event.data)) {
        let data = JSON.parse(event.data);
        if (
          data.speed1 != undefined &&
          data.speed2 != undefined &&
          data.speed3 != undefined
        ) {
          this.speed$.next(data);
        } else if (data.dInputs != undefined) {
          this.dInput$.next(data.dInputs);
        } else if (data.aInputs != undefined) {
          this.aInput$.next(data.aInputs);
        } else if (data.dOutputs != undefined) {
          this.dOutput$.next(data.dOutputs);
        }
      }
    };

    this.webSocket.onclose = (event) => {
      console.log({ Websocket: "CLOSE" });
    };
  }
  getSpeeds() {
    return this.speed$.value;
  }
  sendMessage(msg) {
    this.webSocket.send(msg);
  }
  setAInputs(ainputs) {
    this.aInput$.next(ainputs);
  }
  setGoal(goal: number) {
    let aInputs = this.aInput$.getValue();
    aInputs.forEach((ai) => {
      if (ai.name == "wGoal") {
        ai.value = goal;
        this.sendMessage(JSON.stringify({ goal }));
      }
    });

    this.aInput$.next(aInputs);
  }
  closeWebSocket() {
    this.webSocket.send("Websocket Closed");
    this.webSocket.close();
  }
  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  destructor() {
    this.closeWebSocket();
  }
}
