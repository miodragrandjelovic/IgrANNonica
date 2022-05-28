import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TargetService{
 
    constructor() { }
   
    chosenTarget = new Subject<string>();

    setTarget(message:string){
   
      this.chosenTarget.next(message);
    }   
  }
