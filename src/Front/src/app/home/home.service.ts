import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService{
 
    constructor() { }
   
   
     messageSubject = new Subject<number>();
   
   
    sayMessage(message:number){
   
      this.messageSubject.next(message);
    }
   
  }
