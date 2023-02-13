import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Address from 'src/shared/models/address.model';
import Debtor from 'src/shared/models/debtor.model';
import DebtorHasAddress from 'src/shared/models/debtor_has_address.model';
import Settings from 'src/shared/models/settings.model';
import { NotificationService } from 'src/shared/notifications/notification.service';
import { AddressService } from 'src/shared/services/address.service';
import { DebtorService } from 'src/shared/services/debtor.service';
import { DebtorHasAddressService } from 'src/shared/services/debtor_has_address.service';


@Component({
    selector: 'app-import-debtor',
    templateUrl: './import-debtor.component.html',
    styleUrls: ['./import-debtor.component.scss']
})
export class ImportDebtorComponent implements OnInit {
    settings: Settings = JSON.parse(sessionStorage.getItem('settings'));
    @ViewChild('fileInput') fileInput: ElementRef;

    debtors: Debtor[] = [];
    addresses: Address[] = [];
    livesAts: DebtorHasAddress[] = [];
    fileLabel = 'Choose a CSV file to upload';

    constructor(private titleService: Title, private debtorService: DebtorService, private addressService: AddressService,
                private debtorHasAddressService: DebtorHasAddressService, private toastyService: NotificationService,
                private route: ActivatedRoute, private router: Router) {

        this.titleService.setTitle('Import Debtors - ' + this.settings.company_name);
    }

    ngOnInit(): void { }

    upload(event: any): void {
        this.extractData(event.target);
    }

    setFileName(): void {
        const fi = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            const fileToUpload = fi.files[0];

            if (fileToUpload) {
                this.fileLabel = fileToUpload.name;
            }
        } else {
            this.fileLabel = 'Choose a CSV file to upload';
        }
    }

    private mapToDebtor(data: any[]): void {
        const debtor = new Debtor();
        debtor.id = data[0];
        debtor.first_name = data[1];
        debtor.last_name = data[2];
        debtor.email = data[3];
        debtor.phone = data[4];
        debtor.bank_account = data[5];

        const address = new Address();
        address.street = data[6];
        // tslint:disable-next-line:radix
        address.number = Number.parseInt(data[7]);
        address.suffix = data[8];
        address.postal_code = data[9];
        address.city = data[10];
        address.country = data[11];

        const livesAt = new DebtorHasAddress();
        livesAt.debtor_id = debtor.id;
        livesAt.address_postal = address.postal_code;
        livesAt.address_number = address.number;

        this.debtors.push(debtor);
        this.addresses.push(address);
        this.livesAts.push(livesAt);
    }

    private extractData(fileInput: any): void {

        const fi = this.fileInput.nativeElement;
        const lines = [];

        if (fi.files && fi.files[0]) {
            const fileToUpload = fi.files[0];

            const reader: FileReader = new FileReader();
            reader.readAsText(fileToUpload);

            reader.onload = (e) => {
                const csv = reader.result;
                const allTextLines = csv.toString().split(/\r|\n|\r/);
                const headers = allTextLines[0].split(',');

                for (let i = 1; i < allTextLines.length; i++) {
                    // split content based on comma
                    const data = allTextLines[i].split(',');
                    if (data.length === headers.length) {
                        const tarr = [];
                        for (let j = 0; j < headers.length; j++) {
                            tarr.push(data[j]);
                        }

                        this.mapToDebtor(tarr);
                    }
                }

                this.saveDebtors();
            };
        }
    }

    private saveDebtors(): void {
        let count = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.debtors.length; i++) {
            const debtor = this.debtors[i];

            this.debtorService.create(debtor).subscribe(
                (res) => {
                    count++;
                    if (count === this.debtors.length) {
                        this.toastyService.success('Debtor(s) have been successfully added!', 'Success', 4000);
                    }
                },
                (error) => { throw error; }
            );
        }

        this.createAddresses();
    }

    private createAddresses(): void {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.addresses.length; i++) {
            const address = this.addresses[i];
            this.addressService.create(address).subscribe(
                res => this.linkAddress(),
                (error) => { throw error; }
            );
        }

        setTimeout(() => {
            this.router.navigate(['/debtors']);
        }, 3000);
    }

    private linkAddress(): void {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.livesAts.length; i++) {
            const livesAt = this.livesAts[i];
            this.debtorHasAddressService.create(livesAt).subscribe(
                res => { },
                (error) => { throw error; }
            );
        }
    }
}
