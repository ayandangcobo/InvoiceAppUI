import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomErrorHandler } from 'src/shared/error-handler';
import { UserService } from 'src/shared/services/user.service';
import { ModalModule } from '../modal/modal.module';
import { AddUserComponent } from './add-user/add-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ImportUserComponent } from './import-user/import-user.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';


@NgModule({
    declarations: [
        LoginComponent,
        UserComponent,
        EditUserComponent,
        AddUserComponent,
        DetailUserComponent,
        ImportUserComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule,
        UserRoutingModule
    ],
    providers: [
        UserService,
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ],
    exports: [
        UserComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class UserModule { }
