import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  private params$: BehaviorSubject<string> = new BehaviorSubject('');
  private showHp$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private inputs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private catNum$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private encodings$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    getParamsObs(): Observable<string> {
        return this.params$.asObservable();
    }
    setParamsObs(params: string) {
      console.log('Setovani hiperparametri: ', params);
      this.params$.next(params);
    }

    getShowHp(): Observable<boolean> {
      return this.showHp$.asObservable();
    }
    setShowHp(value: boolean) {
      this.showHp$.next(value);
    }

    getInputs(): Observable<string[]> {
      return this.inputs$.asObservable();
    }
    setInputs(value: string[]) {
      this.inputs$.next(value);
    }

    getCatNum(): Observable<string[]> {
      return this.catNum$.asObservable();
    }

    setCatNum(value: string[]) {
      this.catNum$.next(value);
    }

    getEncodings(): Observable<string[]> {
      return this.encodings$.asObservable();
    }
    setEncodings(value: string[]) {
      this.encodings$.next(value);
    }

  constructor() { }
}
