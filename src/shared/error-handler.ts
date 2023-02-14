import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NotificationsService } from './notifications/notification.service';
import { SpinnerService } from './spinner/spinner.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(private ngZone: NgZone, private notificationService: NotificationsService,
                private spinnerService: SpinnerService
        ) {
    }

    handleError(error: any): void {
        console.log('An error occured!', error);
        this.ngZone.run(() => {
            if (typeof (window) !== 'undefined') {
                const date = new Date().toISOString();

                // Set message based on error
                if (error instanceof HttpErrorResponse) {
                    this.notificationService.error(error.error);
                    console.log(error.error);
                } else if (error instanceof TypeError) {
                    this.notificationService.error(error.message);
                    console.log(error.message);
                } else if (error instanceof Error) {
                    this.notificationService.error(error.message);
                    console.log(error.message);
                } else if (error instanceof Response) {
                    this.notificationService.error(error.statusText);
                    console.log(error.statusText);
                } else {
                    this.notificationService.error(error);
                    console.log(error);
                }

                // Hide spinner on error
                this.spinnerService.hideSpinner();
            }
        });
    }
}
