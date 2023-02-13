import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/shared/authentication.service';
import Settings from 'src/shared/models/settings.model';
import User from 'src/shared/models/user.model';
import { SettingsService } from 'src/shared/services/settings.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    settings: Settings = null;
    currentUser: User = null;
    isSignedIn = false;
    title: string;

    showSpinner = false;

    constructor(private authService: AuthenticationService, private route: ActivatedRoute, private router: Router,
                private _sanitizer: DomSanitizer, private settingsService: SettingsService,
                private titleService: Title, private spinnerService: SpinnerService) {
        this.getSettings();

        this.spinnerService.spinner$.subscribe((data: boolean) => {
            setTimeout(() => {
              this.showSpinner = data ? data : false;
            });
            console.log(this.showSpinner);
          });

    }

    ngOnInit() {
        this.checkIfLoggedIn();
        this.getCurrentRouteTitle();
    }

    checkIfLoggedIn() {
        this.currentUser = JSON.parse(sessionStorage.getItem('signedInUser'));
        if (this.currentUser != null) {
            this.isSignedIn = true;
        } else {
            this.isSignedIn = false;
        }
    }

    getCurrentRouteTitle() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .pipe(map(() => this.route))
            .pipe(map(route => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            }))
            .pipe(filter(route => route.outlet === 'primary'))
            .pipe(mergeMap(route => route.data))
            .subscribe((event) => this.title = event['title']);
    }

    getSettings() {
        this.settings = JSON.parse(sessionStorage.getItem('settings'));
    }

    signOut() {
        this.authService.logout();
        this.checkIfLoggedIn();

        if (!this.isSignedIn) {
            this.router.navigate(['/login']);
        }
    }
}
