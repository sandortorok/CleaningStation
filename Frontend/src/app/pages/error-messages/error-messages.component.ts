import { WebsocketService } from "./../../services/web-socket.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "src/app/services/http.service";

@Component({
  selector: "app-lamps",
  templateUrl: "error-messages.component.html",
  styleUrls: ["./error-messages.component.scss"],
})
export class ErrorMessagesComponent implements OnInit {
  messages: Array<{ message: String; timestamp: String }> = [];
  page = 1;
  pageSize = 20;
  constructor(
    private httpService: HttpService,
    private wss: WebsocketService
  ) {}
  ngOnInit() {
    this.httpService.getErrorMessages().subscribe((res) => {
      let arr = Object.values(res);
      arr.forEach((el) => {
        let date = new Date(el.timestamp);
        var datestring =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2) +
          " " +
          ("0" + date.getHours()).slice(-2) +
          ":" +
          ("0" + date.getMinutes()).slice(-2);
        this.messages.push({ message: el.message, timestamp: datestring });
      });
    });
  }
}
