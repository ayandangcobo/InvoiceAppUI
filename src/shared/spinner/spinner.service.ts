import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public spinner$: Subject<any>;

  constructor() {
    this.spinner$ = new Subject<any>();
  }

  showSpinner(): void {
    this.spinner$.next(true);
  }

  hideSpinner(): void {
    this.spinner$.next(false);
  }
}
