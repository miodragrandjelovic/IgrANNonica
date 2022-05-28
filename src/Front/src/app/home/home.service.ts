import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService{
 
    constructor() { }
   
   
    messageSubject = new Subject<number>();
  
    disableButton = new Subject<boolean>();

    goTrain = new Subject<boolean>();

    sayMessage(message:number){
   
      this.messageSubject.next(message);
    }

    disableClick(message:boolean){
      this.disableButton.next(message);
    }

    goToTraining(message:boolean){
      this.goTrain.next(message);
    }
   
  }
