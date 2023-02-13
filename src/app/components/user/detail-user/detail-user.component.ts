import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Role from 'src/shared/models/role.model';
import Settings from 'src/shared/models/settings.model';
import User from 'src/shared/models/user.model';
import { RoleService } from 'src/shared/services/role.service';
import { UserService } from 'src/shared/services/user.service';


@Component({
    selector: 'app-detail-user',
    templateUrl: './detail-user.component.html',
    styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));
    currentUser: User = JSON.parse(sessionStorage.getItem('signedInUser'));

    email: string;
    user: User;
    roles: Role[] = null;

    constructor(private titleService: Title, private route: ActivatedRoute, private userService: UserService,
                // tslint:disable-next-line:variable-name
                private roleService: RoleService, public _sanitizer: DomSanitizer, private router: Router) { }

    ngOnInit(): void {
        this.titleService.setTitle('User Details - ' + this.settings.company_name);
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

    getUser(email: string): void {
        this.userService.getByEmail(email).subscribe(
            (response) => this.user = response,
            (error) => { throw error; }
        );
    }
}
