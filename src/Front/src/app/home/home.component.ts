import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  value1: number = 70;
  value2: number = 70;
  options1: Options = {
    floor: 0,
    ceil: 100
  };
  options2: Options = {
    floor: 0,
    ceil: 100
  };
  constructor() { }

  ngOnInit(): void {
  }
    currentVal=0;
    getVal(val:any){
    console.warn(val)
    this.currentVal=val;
  }

  }
 
