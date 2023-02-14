import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { timer } from 'rxjs';
import { NotificationsService } from './notification.service';
import { MyNotification } from './notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input()
  notification: MyNotification;

  constructor(private notificationsService: NotificationsService) { }

  pause(): void {
    this.notification.paused.next(true);
  }

  unPause(): void {
    this.notification.paused.next(false);
  }

  remove(): void {
    this.notificationsService.removeNotification(this.notification.id);
  }

}
