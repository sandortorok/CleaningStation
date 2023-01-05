import { Motion, MotionService } from '../../services/motion.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-motion-svg',
  templateUrl: './motor-svg.component.html',
  styleUrls: ['./motor-svg.component.scss']
})
export class MotorSVGComponent implements OnInit {

  rotating:boolean = true;
  auto:boolean = false;
  frequence:number = 0;
  constructor() { }

  ngOnInit(): void {
  }
  changeAuto(mode:string){
    if(mode == 'auto'){
      this.auto = true;
    }
    if(mode == 'manual'){
      this.auto = false;
    }
  }
}
