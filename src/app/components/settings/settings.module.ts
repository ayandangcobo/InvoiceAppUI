import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from 'src/shared/services/settings.service';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings.routing';


@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SettingsRoutingModule
    ],
    providers: [
        SettingsService,
        { provide: ErrorHandler, useClass: ErrorHandler }
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }
