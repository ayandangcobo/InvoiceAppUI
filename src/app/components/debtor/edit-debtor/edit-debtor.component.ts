import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Address from 'src/shared/models/address.model';
import Debtor from 'src/shared/models/debtor.model';
import DebtorHasAddress from 'src/shared/models/debtor_has_address.model';
import Settings from 'src/shared/models/settings.model';
import { AddressService } from 'src/shared/services/address.service';
import { DebtorService } from 'src/shared/services/debtor.service';
import { DebtorHasAddressService } from 'src/shared/services/debtor_has_address.service';
import { SpinnerService } from 'src/shared/spinner/spinner.service';


@Component({
    selector: 'app-edit-debtor',
    templateUrl: './edit-debtor.component.html',
    styleUrls: ['./edit-debtor.component.scss']
})
export class EditDebtorComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));

    debtorId: string;
    debtor: Debtor;
    lives_at: DebtorHasAddress;
    address: Address;

    constructor(private titleService: Title, private route: ActivatedRoute, private debtorService: DebtorService,
                private debtorHasAddressService: DebtorHasAddressService, private addressService: AddressService,
                private router: Router, private spinnerService: SpinnerService
        ) { }

    ngOnInit() {
        this.titleService.setTitle('Edit Debtor - ' + this.settings.company_name);
        this.route.params.subscribe(
            (params) => {
                this.debtorId = params['id'];
                this.getDebtor(this.debtorId);
            }
        );
    }

    getDebtor(id: string) {
        this.debtorService.getById(id).subscribe(
            (response) => {
                this.debtor = response;
                this.getLivesAt();
            },
            (error) => { throw error; }
        );
    }

    getAddress() {
        this.addressService.getAddress(this.lives_at.address_postal, this.lives_at.address_number).subscribe(
            (response) => this.address = response,
            (error) => { throw error; }
        );
    }

    getLivesAt() {
        this.debtorHasAddressService.getByDebtorId(this.debtor.id).subscribe(
            (response) => {
                this.lives_at = response;
                this.getAddress();
            },
            (error) => { throw error; }
        );
    }

    submitForm() {
        // Show spinner
        this.spinnerService.showSpinner();

        this.debtorService.update(this.debtor).subscribe(
            (response) => {
                if ((this.debtor.address.postal_code !== this.address.postal_code)
                    && (this.debtor.address.number !== this.address.number)) {
                    this.createAddress();
                } else {
                    setTimeout(() => {
                        // Hide spinner
                        this.spinnerService.hideSpinner();
                        this.router.navigate(['/debtors']);
                    }, 1500);
                }
            },
            (error) => { throw error; }
        );
    }

    createAddress() {
        const exists = this.addressService.getAddress(this.address.postal_code, this.address.number).subscribe(
            (response) => {
                if (response !== null) {
                    return true;
                } else {
                    return false;
                }
            },
            (error) => { }
        );

        if (exists) {
            this.linkAddress();
        } else {
            this.addressService.create(this.address).subscribe(
                (response) => this.linkAddress(),
                (error) => { throw error; }
            );
        }
    }

    private linkAddress() {
        this.spinnerService.showSpinner();

        const exists = this.debtorHasAddressService.getByDebtorId(this.debtor.id).subscribe(
            (response) => {
                this.spinnerService.hideSpinner();
                if (response != null) {
                    return true;
                } else {
                    return false;
                }
            },
            (error) => { this.spinnerService.hideSpinner(); }
        );

        if (exists) {
            this.debtorHasAddressService.deleteDebtorHasAddress(this.debtor.id, this.address.postal_code, this.address.number).subscribe(
                (response) => { this.spinnerService.hideSpinner(); },
                (error) => { this.spinnerService.hideSpinner(); }
            );
        }

        const debtorAddressLink = new DebtorHasAddress();
        debtorAddressLink.debtor_id = this.debtor.id;
        debtorAddressLink.address_postal = this.address.postal_code;
        debtorAddressLink.address_number = this.address.number;

        this.debtorHasAddressService.create(debtorAddressLink).subscribe(
            (response) => {
                setTimeout(() => {
                    // Hide spinner
                    this.spinnerService.hideSpinner();

                    this.router.navigate(['/debtors']);
                }, 1500);
            },
            (error) => { throw error; }
        );
    }
}
