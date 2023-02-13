import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from 'src/shared/authentication.service';
import { AuthGuard } from 'src/shared/authguard.service';
import { CustomErrorHandler } from 'src/shared/error-handler';
import { NotificationService } from 'src/shared/notifications/notification.service';
import { ApplicationService } from 'src/shared/services/application.service';
import { RoleService } from 'src/shared/services/role.service';
import { SettingsService } from 'src/shared/services/settings.service';
import { SpinnerComponent } from 'src/shared/spinner/spinner.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { DebtorModule } from './components/debtor/debtor.module';
import { InvoiceModule } from './components/invoice/invoice.module';
import { ModalModule } from './components/modal/modal.module';
import { SettingsModule } from './components/settings/settings.module';
import { UserModule } from './components/user/user.module';


export function app_Init(appService: ApplicationService): any {
    return () => appService.initializeApp();
}

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        UserModule,
        DashboardModule,
        DebtorModule,
        InvoiceModule,
        SettingsModule,
        ModalModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule
    ],
    exports: [
    ],
    providers: [
        RoleService,
        SettingsService,
        ApplicationService,
        NotificationService,
        { provide: AuthGuard, useClass: AuthGuard },
        { provide: AuthenticationService, useClass: AuthenticationService },
        { provide: ErrorHandler, useClass: CustomErrorHandler },
        { provide: APP_INITIALIZER, useFactory: app_Init, deps: [ApplicationService], multi: true },
    ],
    bootstrap: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }
