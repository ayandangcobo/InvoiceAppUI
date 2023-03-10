import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Settings from '../models/settings.model';

@Injectable()
export class ApplicationService {
    private apiUrl = environment.apiBase + '/settings/';

    constructor(public http: HttpClient) { }

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.apiUrl + 'get')
                .toPromise()
                .then(
                    (response) => {
                        const data = response as Settings;
                        sessionStorage.setItem('settings', JSON.stringify(data));
                        resolve(null);
                    }
                ).catch(this.handleError());
        });
    }

    // tslint:disable-next-line:typedef
    private handleError(data?: any) {
        return (error: any) => {
            console.log(error);
        };
    }
}
