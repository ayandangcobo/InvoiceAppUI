import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Settings from 'src/shared/models/settings.model';
import { SettingsService } from 'src/shared/services/settings.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    settings: Settings = null;
    fileLabel = 'Choose an image to use as logo';

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private settingsService: SettingsService, private titleService: Title, private route: ActivatedRoute,
                private router: Router, private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.titleService.setTitle('Settings - Invoice Panel');
        this.getSettings();
    }

    getSettings(): void {
        this.settings = JSON.parse(sessionStorage.getItem('settings'));
    }

    submitForm(): void {
        // Show spinner
        this.spinnerService.showSpinner();

        this.settingsService.update(this.settings).subscribe(
            (response) => this.fileUpload(response),
            (error) => { throw error; }
        );
    }

    fileUpload(settings: Settings): void {
        const fi = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            const fileToUpload = fi.files[0];

            if (fileToUpload) {
                this.settingsService.upload(fileToUpload, settings).subscribe(
                    (response) => {
                        sessionStorage.setItem('settings', JSON.stringify(response));

                        setTimeout(() => {
                            // Hide spinner
                            this.spinnerService.hideSpinner();

                            sessionStorage.setItem('force', JSON.stringify(true));
                            this.router.navigate(['/']);
                        }, 1500);
                    },
                    (error) => { throw (error); }
                );
            }
        } else {
            sessionStorage.setItem('settings', JSON.stringify(settings));

            setTimeout(() => {
                // Hide spinner
                this.spinnerService.hideSpinner();

                sessionStorage.setItem('force', JSON.stringify(true));
                this.router.navigate(['/']);
            }, 1500);
        }
    }

    setFileName(): void {
        const fi = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            const fileToUpload = fi.files[0];

            if (fileToUpload) {
                this.fileLabel = fileToUpload.name;
            }
        } else {
            this.fileLabel = 'Choose an image to use as logo';
        }
    }
}
