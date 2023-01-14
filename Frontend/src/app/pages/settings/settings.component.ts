import { HttpService } from '../../services/http.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-switches",
  templateUrl: "settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  number: number = 10
  pumpOrder:Array<{id: Number, name: String}> = []
  constructor(private httpService: HttpService) {}
  ngOnInit() {
    this.httpService.getPumpOrder().subscribe(res=>{
      Object.values(res).forEach(pump=>{
        this.pumpOrder[pump.idx]= {id: pump.id, name: pump.name}
      })
    })
  }
  change(event){

  }
  add(){
    this.number++
  }
  descrease(){
    this.number--
  }
  moveUp(id){
    let idx = -1
    this.pumpOrder.forEach((pump,index)=>{
      if(pump.id === id){
        idx = index
      }
    })
    if(idx === -1 || idx === 0) return;
    else{
      this.array_move(this.pumpOrder, idx, idx-1)
    }
    this.httpService.savePumpOrder(this.pumpOrder).subscribe(res=>{})
  }
  moveDown(id){
    let idx = -1
    this.pumpOrder.forEach((pump,index)=>{
      if(pump.id === id){
        idx = index
      }
    })
    if(idx === -1 || idx === this.pumpOrder.length-1) return;
    else{
      this.array_move(this.pumpOrder, idx, idx+1)
    }
    this.httpService.savePumpOrder(this.pumpOrder).subscribe(res=>{})
  }
  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};
}
