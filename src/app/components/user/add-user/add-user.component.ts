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
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));
    @ViewChild('fileInput') fileInput: ElementRef;

    forCompany: boolean;
    user: User = new User();
    roles: Role[] = null;
    fileLabel = 'Choose an image to use as profile picture';

    constructor(private titleService: Title, private route: ActivatedRoute, private userService: UserService,
                private roleService: RoleService, private router: Router, private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.titleService.setTitle('Create User - ' + this.settings.company_name);
        this.forCompany = false;
        this.user.role_id = 0;

        this.route.params.subscribe(
            (params) => {
                this.forCompany = params[`company`] === 'yes' ? true : false;
            }
        );
        this.getRoles();
    }

    changeForm(event: any): void {
        if (event.target.checked) {
            this.forCompany = true;
        } else {
            this.forCompany = false;
        }
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

        this.user.role_id = Number(this.user.role_id);
        this.userService.create(this.user).subscribe(
            (response) => {
                if (response != null) {
                    this.fileUpload();
                }
            },
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
                        setTimeout(() => {
                            // Hide spinner
                            this.spinnerService.hideSpinner();
                            this.router.navigate(['/users']);
                        }, 1500);
                    },
                    (error) => { throw (error); }
                );
            }
        } else {
            setTimeout(() => {
                // Hide spinner
                this.spinnerService.hideSpinner();
                this.router.navigate(['/users']);
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
