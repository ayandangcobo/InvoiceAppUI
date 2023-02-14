import { Component } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { NotificationsService } from './notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('100ms ease-in-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationsComponent {

  notifications$;

  constructor(private _notificationsService: NotificationsService) {
    this.notifications$ = this._notificationsService.getNotifications();
  }

  trackById(index, item) {
    return item.id;
  }
}
