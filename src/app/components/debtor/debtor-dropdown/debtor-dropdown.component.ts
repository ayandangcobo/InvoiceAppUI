import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Debtor from 'src/shared/models/debtor.model';
import { AddressService } from 'src/shared/services/address.service';
import { DebtorService } from 'src/shared/services/debtor.service';
import { DebtorHasAddressService } from 'src/shared/services/debtor_has_address.service';


@Component({
    selector: 'app-debtor-dropdown',
    templateUrl: './debtor-dropdown.component.html',
    styleUrls: ['./debtor-dropdown.component.scss']
})
export class DebtorDropdownComponent implements OnInit {
    debtors: Debtor[] = [];
    selectedDebtor: Debtor;
    isReady = false;

    @Output() chosenDebtor = new EventEmitter<Debtor>();

    constructor(private debtorService: DebtorService, private debtorHasAddressService: DebtorHasAddressService,
                private addressService: AddressService) { }

    ngOnInit() {
        this.getAllDebtors();
    }

    setDebtor(event: any) {
        this.selectedDebtor = (event as Debtor);
        this.chosenDebtor.emit(this.selectedDebtor);
    }

    getAllDebtors() {
        this.debtorService.getAll().subscribe(
            (response) => { this.debtors = response; this.isReady = true; },
            (error) => { throw (error); }
        );
    }
}
