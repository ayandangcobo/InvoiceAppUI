import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Notifications, NotificationType } from './notification';


@Injectable()
export class NotificationService {

  // tslint:disable-next-line:variable-name
  private _subject = new Subject<Notifications>();
  // tslint:disable-next-line:variable-name
  private _idx = 0;

  constructor() { }

  getObservable(): Observable<Notifications> {
    return this._subject.asObservable();
  }

  info(title: string, message: string, timeout = 3000): void {
    this._subject.next(new Notifications(this._idx++, NotificationType.info, title, message, timeout));
  }

  success(title: string, message: string, timeout = 3000): void {
    this._subject.next(new Notifications(this._idx++, NotificationType.success, title, message, timeout));
  }

  warning(title: string, message: string, timeout = 3000): void {
    this._subject.next(new Notifications(this._idx++, NotificationType.warning, title, message, timeout));
  }

  error(title: string, message: string, timeout = 0): void {
    this._subject.next(new Notifications(this._idx++, NotificationType.error, title, message, timeout));
  }

}
