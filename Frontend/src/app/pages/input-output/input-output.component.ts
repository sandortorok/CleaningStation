import { WebsocketService } from './../../services/web-socket.service';
import { Component, OnInit } from '@angular/core';


export interface dInput{
  name:String,
  description: String,
  bit: Number,
  is_on: Boolean
}

export interface aInput{
  name: String,
  description: String,
  bit: Number,
  value: Number
}

export interface dOutput{
  name:String,
  description: String,
  bit: Number,
  is_on: Boolean
}
@Component({
  selector: 'app-input-output',
  templateUrl: './input-output.component.html',
  styleUrls: ['./input-output.component.scss']
})
export class InputOutputComponent implements OnInit {
  constructor(private wss: WebsocketService){}
  dInputs:dInput[] = []
  aInputs:aInput[] = []
  dOutputs:dOutput[] = []
  ngOnInit(){
    this.wss.dInputCast.subscribe(arr=>{
      this.dInputs = arr
    })
    this.wss.aInputCast.subscribe(arr=>{
      this.aInputs = arr
    })
    this.wss.dOutputCast.subscribe(arr=>{
      this.dOutputs = arr
    })
  }
}
