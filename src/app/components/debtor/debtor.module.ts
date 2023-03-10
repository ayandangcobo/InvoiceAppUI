import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomErrorHandler } from 'src/shared/error-handler';
import { AddressService } from 'src/shared/services/address.service';
import { DebtorService } from 'src/shared/services/debtor.service';
import { DebtorHasAddressService } from 'src/shared/services/debtor_has_address.service';
import { ModalModule } from '../modal/modal.module';
import { AddDebtorComponent } from './add-debtor/add-debtor.component';
import { DebtorComponent } from './debtor.component';
import { DebtorRoutingModule } from './debtor.routing';
import { DetailDebtorComponent } from './detail-debtor/detail-debtor.component';
import { EditDebtorComponent } from './edit-debtor/edit-debtor.component';
import { ImportDebtorComponent } from './import-debtor/import-debtor.component';


@NgModule({
    declarations: [
        DebtorComponent,
        AddDebtorComponent,
        DetailDebtorComponent,
        EditDebtorComponent,
        ImportDebtorComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule,
        DebtorRoutingModule
    ],
    providers: [
        DebtorService,
        AddressService,
        DebtorHasAddressService,
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ],
    exports: [
        DebtorComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class DebtorModule { }
