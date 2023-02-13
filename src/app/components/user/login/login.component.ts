import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/shared/authentication.service';
import Settings from 'src/shared/models/settings.model';
import { UserService } from 'src/shared/services/user.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    settings: Settings;
    email = '';
    password = '';
    returnUrl: string;

    constructor(private titleService: Title, private route: ActivatedRoute, private userService: UserService,
                private router: Router, private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService) {
        this.settings = JSON.parse(sessionStorage.getItem('settings'));
    }

    ngOnInit(): void {
        console.log(`login..`);
        this.titleService.setTitle('Sign In - ' + this.settings.company_name);

        // reset login status
        this.authenticationService.logout();

        // get possible return url
        const retUrl = this.route.snapshot.queryParams[`returnUrl`] || '/';
        this.returnUrl = retUrl === '/' ? '/dashboard' : this.route.snapshot.queryParams[`returnUrl`];
    }

    checkCredentials(): void {
        this.spinnerService.showSpinner();
        this.authenticationService.login(this.email, this.password)
            .subscribe(
                (response) => {
                    sessionStorage.setItem('signedInUser', JSON.stringify(response));
                    this.spinnerService.hideSpinner();
                    this.router.navigate([this.returnUrl]);
                    // setTimeout(() => {
                    //     // this.router.navigateByUrl(this.returnUrl);
                    //     this.router.navigate([this.returnUrl]);
                    // }, 1500);
                },
                (error) => { this.spinnerService.hideSpinner(); throw (error); }
            );
    }
}
