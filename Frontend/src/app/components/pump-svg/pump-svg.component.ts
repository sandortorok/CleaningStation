import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pump-svg',
  templateUrl: './pump-svg.component.html',
  styleUrls: ['./pump-svg.component.scss']
})
export class PumpSVGComponent implements OnInit {
  @Input() speed = 0;
  constructor() { }

  ngOnInit(): void {
  }
}

