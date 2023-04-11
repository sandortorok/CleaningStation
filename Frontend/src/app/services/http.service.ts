import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  // private url:string = 'http://10.100.0.233:3000';
  private url: string = "http://192.168.0.15:3000";
  // private url: string = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getYears(endPointName: String) {
    return this.http.get(this.url + `/${endPointName}/years`);
  }

  getYear(endPointName: String, date) {
    return this.http.post(this.url + `/${endPointName}/year`, { date: date });
  }

  getMonth(endPointName: String, date) {
    return this.http.post(this.url + `/${endPointName}/month`, { date: date });
  }

  getWeek(endPointName: String, date) {
    return this.http.post(this.url + `/${endPointName}/week`, { date: date });
  }

  getDay(endPointName: String, date) {
    return this.http.post(this.url + `/${endPointName}/day`, { date: date });
  }

  getToday(endPointName: String, date, hour) {
    return this.http.post(this.url + `/${endPointName}/hour`, {
      date: date,
      hour: hour,
    });
  }

  getErrorMessages() {
    return this.http.get(this.url + `/errorMessages`);
  }
  getPumpOrder() {
    return this.http.get(this.url + "/frequencies");
  }
  savePumpOrder(pumps) {
    return this.http.post(this.url + "/frequencies/order", { pumps });
  }
  getPressures() {
    return this.http.get(this.url + "/pressures");
  }
  getGoalPressure() {
    return this.http.get(this.url + "/pressures/goal");
  }
  saveGoalPressure(pressure) {
    return this.http.post(this.url + "/aInputs/goal", { pressure });
  }
}
