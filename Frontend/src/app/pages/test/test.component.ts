import { Component } from "@angular/core";
import { WebsocketService } from "src/app/services/web-socket.service";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
})
export class TestComponent {
  freq1Val: number;
  freq2Val: number;
  freq3Val: number;
  constructor(private wss: WebsocketService) {}
  startClick(id) {
    this.wss.sendMessage(JSON.stringify({ start: id }));
  }
  stopClick(id) {
    this.wss.sendMessage(JSON.stringify({ stop: id }));
  }
  changeFreq(id, value) {
    if (value === undefined || value <= 0 || value > 50) return;
    this.wss.sendMessage(JSON.stringify({ change: id, value: value }));
  }
}
