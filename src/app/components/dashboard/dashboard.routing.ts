import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/authguard.service';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: 'dashboard',
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: {
                    title: 'Dashboard',
                    roles: [1, 2]
                }
            }]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class DashboardRoutingModule { }
