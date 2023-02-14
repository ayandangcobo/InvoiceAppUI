import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from './notification.service';
import { NotificationsComponent } from './notifications.component';
import { NotificationComponent } from './notification.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NotificationsComponent, NotificationComponent],
  exports: [NotificationsComponent],
  providers: [NotificationsService],
  bootstrap: []
})
export class NotificationsModule { }
