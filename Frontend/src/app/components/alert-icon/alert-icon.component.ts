import { Component, Input } from '@angular/core';

enum iconType{
  success = 1,
  error = 2
}
@Component({
  selector: 'app-alert-icon',
  templateUrl: './alert-icon.component.html',
  styleUrls: ['./alert-icon.component.scss']
})
export class AlertIconComponent {
  @Input() type: iconType = iconType.success;
}
