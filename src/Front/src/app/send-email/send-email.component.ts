import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {

  constructor() { }

  isEmailSentSuccess:boolean;

  PosaljiEmail(){
    this.isEmailSentSuccess = true;
  }
  ngOnInit(): void {
    this.isEmailSentSuccess = false;
  }

}
