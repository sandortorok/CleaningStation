import { Component, Input } from '@angular/core';

enum iconType{
  success = 0,
  error = 1
}
@Component({
  selector: 'app-alert-icon',
  templateUrl: './alert-icon.component.html',
  styleUrls: ['./alert-icon.component.scss']
})
export class AlertIconComponent {
  @Input() type: iconType = iconType.success;
  allIconTypes = iconType;
}
