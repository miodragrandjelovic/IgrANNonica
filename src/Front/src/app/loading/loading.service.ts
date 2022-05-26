import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingService{
  
  private showSpinner$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
   
  getShowSpinner(): Observable<boolean> {
    return this.showSpinner$.asObservable();
    
}
setShowSpinner(value: boolean) {
  this.showSpinner$.next(value);
}  
  }
