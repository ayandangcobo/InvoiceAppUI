import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Address from 'src/shared/models/address.model';
import Debtor from 'src/shared/models/debtor.model';
import DebtorHasAddress from 'src/shared/models/debtor_has_address.model';
import Settings from 'src/shared/models/settings.model';
import User from 'src/shared/models/user.model';
import { NotificationsService } from 'src/shared/notifications/notification.service';
import { AddressService } from 'src/shared/services/address.service';
import { DebtorService } from 'src/shared/services/debtor.service';
import { DebtorHasAddressService } from 'src/shared/services/debtor_has_address.service';
import { UserService } from 'src/shared/services/user.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-add-debtor',
    templateUrl: './add-debtor.component.html',
    styleUrls: ['./add-debtor.component.scss']
})
export class AddDebtorComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));

    forCompany: boolean;
    debtor: Debtor = new Debtor();
    address: Address = new Address();

    addressExists = false;
    hasAddressExists = false;

    constructor(private titleService: Title, private debtorService: DebtorService, private debtorHasAddressService: DebtorHasAddressService,
                private addressService: AddressService, private userService: UserService,
                private router: Router, private spinnerService: SpinnerService,
                private notificationService: NotificationsService) { }

    ngOnInit(): void {
        this.titleService.setTitle('Create Debtor - ' + this.settings.company_name);
        this.forCompany = false;
    }

    changeForm(event: any): void  {
        if (event.target.checked) {
            this.forCompany = true;
        } else {
            this.forCompany = false;
        }
    }

    submitForm(): void  {
        // Show spinner
        this.spinnerService.showSpinner();
        console.log(`add debtor..`);
        this.debtorService.create(this.debtor).subscribe(
            (response) => {
                this.notificationService.success(`Added successfully.`, `Debtor`);
                if (this.debtor.address == null) {
                    this.checkAddressExists();
                } else {
                    setTimeout(() => {
                        // Hide spinner
                        this.spinnerService.hideSpinner();
                        this.router.navigate(['/debtors']);
                    }, 1500);
                }
                this.spinnerService.hideSpinner();
            },
            (error) => { this.spinnerService.hideSpinner(); throw error; }
        );
    }

    private checkAddressExists(): void  {
        this.addressService.addressExists(this.address.postal_code, this.address.number).subscribe(
            (response) => {
                this.addressExists = response;
                this.createAddress();
                this.spinnerService.hideSpinner();
            },
            (error) => { throw error; }
        );
    }

    private createAddress(): void  {
        this.spinnerService.showSpinner();
        if (this.addressExists) {
            this.checkHasAddressExists();
            this.spinnerService.hideSpinner();
        } else {
            this.addressService.create(this.address).subscribe(
                (res) => {
                    this.checkHasAddressExists();
                    this.notificationService.success(`Added success. `, `Address`,);
                },
                (error) => { throw error; }
            );
            this.spinnerService.hideSpinner();
        }
    }

    private checkHasAddressExists(): void  {
        this.spinnerService.showSpinner();
        this.debtorHasAddressService.hasAddressExists(this.debtor.id).subscribe(
            (response) => {
                this.hasAddressExists = response;
                this.createHasAddress();
                this.spinnerService.hideSpinner();
            },
            (error) => { throw error; }
        );
    }

    private createHasAddress(): void  {
        if (this.hasAddressExists) {
            this.deleteHasAddress();
        } else {
            const debtorAddressLink = new DebtorHasAddress();
            debtorAddressLink.debtor_id = this.debtor.id;
            debtorAddressLink.address_postal = this.address.postal_code;
            debtorAddressLink.address_number = this.address.number;

            this.debtorHasAddressService.create(debtorAddressLink).subscribe(
                (response) => this.createUser(),
                (error) => { throw error; }
            );
        }
    }

    private deleteHasAddress(): void  {
        this.debtorHasAddressService.deleteDebtorHasAddress(this.debtor.id, this.address.postal_code, this.address.number).subscribe(
            (response) => { this.createHasAddress(); },
            (error) => { throw error; }
        );
    }

    private createUser(): void  {
        const user = new User();
        user.email = this.debtor.email;
        user.role_id = 2;

        if (this.debtor.company_name == null) {
            user.first_name = this.debtor.first_name;
            user.last_name = this.debtor.last_name;
        } else {
            user.company_name = this.debtor.company_name;
        }

        this.userService.create(user).subscribe(
            (response) => {
                setTimeout(() => {

                    this.router.navigate(['/debtors']);
                }, 1500);
            },
            (error) => { throw error; }
        );
    }
}
