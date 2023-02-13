import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Role from 'src/shared/models/role.model';
import Settings from 'src/shared/models/settings.model';
import User from 'src/shared/models/user.model';
import { RoleService } from 'src/shared/services/role.service';
import { UserService } from 'src/shared/services/user.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));
    currentUser: User = JSON.parse(sessionStorage.getItem('signedInUser'));
    @ViewChild('fileInput') fileInput: ElementRef;

    email: string;
    user: User;
    roles: Role[] = null;
    fileLabel = 'Choose an image to use as profile picture';

    constructor(private titleService: Title, private route: ActivatedRoute, private userService: UserService,
                private roleService: RoleService, private router: Router,
                private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.titleService.setTitle('Edit User - ' + this.settings.company_name);
        this.route.params.subscribe(
            (params) => {
                this.email = params[`email`];
                this.getRoles();
                this.getUser(this.email);
            }
        );
    }

    getRoles(): void {
        this.roleService.getAll().subscribe(
            (response) => this.roles = response,
            (error) => { throw error; }
        );
    }

    submitForm(): void {
        // Show spinner
        this.spinnerService.showSpinner();
        this.userService.update(this.user).subscribe(
            (response) => {
                if (response != null && (this.fileInput.nativeElement.files && this.fileInput.nativeElement.files[0])) {
                    this.fileUpload();
                } else {
                    // IF current user equals currently signed in user then update user in session storage
                    if (this.user.email === this.currentUser.email) {
                        sessionStorage.setItem('signedInUser', JSON.stringify(response));
                    }

                    setTimeout(() => {

                        this.router.navigate(['/']);
                    }, 1500);
                }
            },
            (error) => { throw error; }
        );
    }

    getUser(email: string): void {
        this.userService.getByEmail(email).subscribe(
            (response) => this.user = response,
            (error) => { throw error; }
        );
    }

    fileUpload(): void {
        const fi = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            const fileToUpload = fi.files[0];

            if (fileToUpload) {
                this.userService.upload(fileToUpload, this.user).subscribe(
                    (response) => {
                        // IF current user equals currently signed in user then update user in session storage
                        if (this.user.email === this.currentUser.email) {
                            sessionStorage.setItem('signedInUser', JSON.stringify(response));
                        }

                        setTimeout(() => {

                            this.router.navigate(['/']);
                        }, 1500);
                    },
                    (error) => { throw error; }
                );
            }
        } else {
            setTimeout(() => {
                // Hide spinner
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
            this.fileLabel = 'Choose an image to use as profile picture';
        }
    }
}
