import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
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
  itemsPerPage: number = 15;
  itemPosition: number = 0;
  currentPage: number = 1;
  //response: any;
  //headers: any;
  header:any;
  rowLines: any;
  dataLength:any;
  target:any = [];
  input:any = [];
  hp:string;


  ngOnChanges(changes: SimpleChanges): void {
    //alert("Promena Inputa");
    // dobili smo nov input koji treba da isparsiramo u tabelu
    //this.headingLines = [];
    //this.rowLines = [];

    //let allLines = JSON.parse(this.result); // parsiramo ceo string koji smo dobili
    //console.log(allLines);

    console.log(typeof(this.result));

    this.dataLength = this.result.length;
    this.header = [];
    this.rowLines = [];
    this.allData = [];
    this.input = [];
    this.target = [];
    this.hp = '';
    for (var i=0; i< this.result.length; i++)
    {
      if (i == 0){ // ovo je header
        var headingLine = Object.keys(this.result[i]);
        //console.log(headingLine);
        for (var j=0; j<headingLine.length; j++)
        {
          this.header.push(headingLine[j]);
        }
        //input i label
        for (var j = 0; j<headingLine.length -1 ;j++)
        {
          this.input.push(headingLine[j]);
          // hiperparametri!!!
          if (j != 0) {
            this.hp = this.hp.concat("," + headingLine[j]);
         }
         else
         this.hp = this.hp.concat('' + headingLine[j]);
        }

        this.target.push(this.header[this.header.length-1]);
        console.log("TARGET "+this.target);

        this.hp = this.hp.concat(",", this.target);


        //console.log(this.header);
      }
       // ovo su linije
        var line = Object.values(this.result[i]);
        //console.log(line);
        var rowLine = [];
        for (var j = 0 ; j < line.length; j ++)
        {
            rowLine.push(line[j]);
        }
        this.allData.push(rowLine);
        this.rowLines = this.allData.slice(0, this.itemsPerPage);
    }

    //console.log(this.header);
    //console.log(this.rowLines);

    
    this.parametersService.setParamsObs(this.hp);

  }

  ngOnInit(){}

 

  changePage() {
    this.rowLines = this.allData.slice(this.itemsPerPage * (this.currentPage - 1),this.itemsPerPage * (this.currentPage - 1) + this.itemsPerPage)
  }

  fetchInputsOutputs(selected:any){
    console.log("SELECTED ", selected);
  }
}

