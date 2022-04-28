import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { concat } from 'rxjs';
import { ParametersService } from '../services/parameters.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {


  constructor(private parametersService: ParametersService){  }
  
  @Input() result: string; // ovo je json 

  //map : any;
  //niz:any;

  //dataObject: any = [];
  //headingLine: any = [];
  //rowLines: any = [];
  allData: any = [];
  //rowsArray: any = [];
  //matrix: any = [];
  itemsPerPage: number = 6;
  itemPosition: number = 0;
  currentPage: number = 1;
  //response: any;
  //headers: any;
  header:any;
  rowLines: any;
  dataLength:any;
  target:string;
  inputs:any = [];
  selected:any = [];
  hp:string;
  preload:any = [];


  ngOnChanges(changes: SimpleChanges): void {

    this.dataLength = this.result.length;
    this.header = [];
    this.rowLines = [];
    this.allData = [];
    this.inputs = [];
    this.selected = [];
    this.target = '';
    this.hp = '';
    for (let i = 0; i < this.result.length; i++) {
      if (i == 0) {
        var headingLine = Object.keys(this.result[i]);
        for (let j = 0; j < headingLine.length; j++) {
          this.header.push(headingLine[j]);
          
            if (j != headingLine.length - 1) {
              this.preload[j] = 'input'
              this.inputs.push(headingLine[j]);
            }
            else {
              this.preload[j] = 'target'
              this.target = headingLine[j];
            }
        }
      }
        let line = Object.values(this.result[i]);
        let rowLine = [];
        for (let j = 0 ; j < line.length; j ++) {
            rowLine.push(line[j]);
        }
        this.allData.push(rowLine);
        this.rowLines = this.allData.slice(0, this.itemsPerPage);
    }
    
    for (let i = 0; i < this.inputs.length; i++) {
      if (i != 0) {
        this.hp = this.hp.concat(',' + this.inputs[i]);
      }
      else {
        this.hp = this.hp.concat(this.inputs[i]);
      }
    }
    this.hp = this.hp.concat(',' + this.target);
    this.parametersService.setParamsObs(this.hp);

    this.scrollToTable();

  }

  ngOnInit(){}

  scrollToTable() {
    var elementUlog: any;
    var elementNeulog: any;
    var element: any;
    elementUlog = document.getElementById("prikazTabeleUlogovanog");
    elementNeulog = document.getElementById("prikazTabeleNeulogovanog");
    
    if (elementUlog){
      //alert("prikaz ulog");
      element = elementUlog;

      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
    }
    else{
      //alert("prikaz neulog");
    }
  }
 

  changePage() {
    this.rowLines = this.allData.slice(this.itemsPerPage * (this.currentPage - 1),this.itemsPerPage * (this.currentPage - 1) + this.itemsPerPage)
  }

  fetchInputsOutputs(event: any, index: number) {
    this.target = '';
    this.inputs = [];
    this.hp = '';
    this.preload[index] = event;
    if(event === 'target') {
      for(let i = 0; i < this.preload.length; i++){
        if(i !== index && this.preload[i]==='target') this.preload[i] = 'input';
      }
    }
    for (let i = 0; i < this.preload.length; i++) {
      if (this.preload[i] === 'input') {
        this.inputs.push(this.header[i]);
      }
      else if (this.preload[i] === 'target')
        this.target = this.header[i];
    }
    for (let i = 0; i < this.inputs.length; i++) {
      if (i != 0) 
        this.hp = this.hp.concat(',' + this.inputs[i]);
      else
        this.hp = this.hp.concat(this.inputs[i]);
    }
    
    this.hp = this.hp.concat(',' + this.target);
    this.parametersService.setParamsObs(this.hp);
  }


  showAll(event:any)
  {/*
    alert("event id "+event.target.id);
    var objectList = event.target.querySelectorAll("td"); // selekt svih divova u tom redu
    alert("Imamo "+objectList.length);
    for (let i = 0; i < objectList.length; i++)
    {
      alert("DIV "+objectList[i].innerHTML);
      objectList[i].style.backgroundColor = "red";
    }*/
  }

  hideAll(event:any)
  {
    
  }

  showAndHide(event:any)
  {
    alert("event "+event.target);
  }
}

