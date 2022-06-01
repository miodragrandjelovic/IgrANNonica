import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from '../services/parameters.service';
import { MessageService } from './home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MessageService],
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  session: any;
  edited: boolean = false; 
  currentActive:number;
  trainingInProgress:boolean;

  constructor(private http: HttpClient, private service: MessageService) { }

  ngOnInit(): void {
    this.trainingInProgress = false;
    this.showCsvData();  
    this.session = sessionStorage.getItem('username');

    this.service.disableButton.subscribe({
      next: dis => {
        this.trainingInProgress = dis;
      }
    });

    this.service.goTrain.subscribe({
      next: train => {
        if (train == true){
          this.showHyperp();    
        }
      }
    });

    this.service.refreshP.subscribe({
      next: ref=>{
        if (ref){
          alert("Alert");
          this.ngOnInit();
        }
        else{
          alert("not ref");
        }
      }
    });
  }

  // salje se komponenta child-u <app-csv> poruka je 0
  showCsvData(){
    this.service.sayMessage(0);
    this.currentActive = 0;
  }

  // salje se komponenta childu <app-hyperparameters> - poruka je 1
  showHyperp(){
    this.service.sayMessage(1);
    this.currentActive = 1;
  }


  showCsv() {
    this.edited = true;
  }
  showHp() {
    this.edited = false;
  }

  showPredict(){
    this.service.sayMessage(3);
    this.currentActive = 3;
  }

  isTrainingInProgress():boolean{
    //trening u toku
    if (this.trainingInProgress) return false;
    //trening nije u toku
    else return true;
  }

}