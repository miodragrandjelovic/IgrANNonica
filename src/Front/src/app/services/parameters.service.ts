import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  private params$: BehaviorSubject<string> = new BehaviorSubject('');
  private showHp$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private showGraphic$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    getParamsObs(): Observable<string> {
        return this.params$.asObservable();
    }
    setParamsObs(params: string) {
        this.params$.next(params);
    }

    getShowHp(): Observable<boolean> {
      return this.showHp$.asObservable();
    }
    setShowHp(value: boolean) {
      this.showHp$.next(value);
    }

    getShowGraphic(): Observable<boolean> {
      return this.showGraphic$.asObservable();
    }
    setShowGraphic(value: boolean) {
      this.showGraphic$.next(value);
    }

  constructor() { }
}
