import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyNotification } from './notification';
import { getPausableTimer } from './utils';



@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications$ = new BehaviorSubject<MyNotification[]>([]);

  public getNotifications(): Observable<MyNotification[]> {
    return this.notifications$;
  }

  private addNotification(notification: MyNotification): void {
    if (notification && notification.options && notification.options.timeout) {
      notification.obs = getPausableTimer(notification.options.timeout, notification.paused);
      notification.obs.completeTimer
        .pipe(tap(() => this.removeNotification(notification.id))).subscribe();
    }
    this.next([...this.notifications$.getValue(), notification]);
  }

  public removeNotification(id: number): void {
    this.next(this.notifications$.getValue().filter(_ => _.id !== id));
  }

  private next(notifications: MyNotification[]): void {
    this.notifications$.next(notifications);
  }

  public error(message: string, title: string = 'Error'): void {
    const notification = {
      title, text: message, level: 'error',
      options: { timeout: 10 }
    };
    const n = new MyNotification(notification);
    this.addNotification(n);
  }

  public warning(message: string, title: string = 'Warning'): void {
    const notification = {
      title, text: message, level: 'warning',
      options: { timeout: 10 }
    };
    const n = new MyNotification(notification);
    this.addNotification(n);

  }

  public success(message: string, title: string = 'Success'): void {
    const notification = {
      title, text: message, level: 'success',
      options: { timeout: 10 }
    };
    const n = new MyNotification(notification);
    this.addNotification(n);

  }

}
