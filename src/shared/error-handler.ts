import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NotificationService } from './notifications/notification.service';
import { SpinnerService } from './spinner/spinner.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(private ngZone: NgZone, private toastrService: NotificationService,
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
                    this.toastrService.error(error.error, 'Error');
                } else if (error instanceof TypeError) {
                    this.toastrService.error(error.message, 'Error');
                } else if (error instanceof Error) {
                    this.toastrService.error(error.message, 'Error');
                } else if (error instanceof Response) {
                    this.toastrService.error(error.statusText, 'Error');
                } else {
                    this.toastrService.error(error, 'Error');
                }

                // Hide spinner on error
                this.spinnerService.hideSpinner();
            }
        });
    }
}
