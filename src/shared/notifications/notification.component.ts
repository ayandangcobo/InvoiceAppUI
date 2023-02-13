import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Notifications, NotificationType } from './notification';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {

    notifications: Notifications[] = [];
    // tslint:disable-next-line:variable-name
    private _subscription: Subscription;

    // tslint:disable-next-line:variable-name
    constructor(private _notificationSvc: NotificationService) { }

    private _addNotification(notification: Notifications): void {
        this.notifications.push(notification);

        if (notification.timeout !== 0) {
            setTimeout(() => this.close(notification), notification.timeout);

        }
    }

    ngOnInit(): void {
        this._subscription = this._notificationSvc.getObservable().subscribe(notification => this._addNotification(notification));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    close(notification: Notifications): void {
        this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
    }


    className(notification: Notifications): string {

        let style: string;

        switch (notification.type) {

            case NotificationType.success:
                style = 'success';
                break;

            case NotificationType.warning:
                style = 'warning';
                break;

            case NotificationType.error:
                style = 'error';
                break;

            default:
                style = 'info';
                break;
        }

        return style;
    }
}
