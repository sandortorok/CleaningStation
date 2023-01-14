import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-on-off-button',
  templateUrl: './on-off-button.component.html',
  styleUrls: ['./on-off-button.component.scss']
})
export class OnOffButtonComponent {
  @Input() is_on:Boolean = false;
}
