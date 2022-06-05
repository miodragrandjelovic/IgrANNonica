import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { concat } from 'rxjs';
import { ParametersService } from '../services/parameters.service';
import { TargetService } from './table.service'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {


  constructor(private parametersService: ParametersService, private liveAnouncer: LiveAnnouncer, private targetService:TargetService){  }
  
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

  searchInput:any=[];
  allDataCopy1:any=[];
  allDataCopy2:any=[];
  searchData:any=[];


  ngOnChanges(changes: SimpleChanges): void {
 //   console.log('IZMENJENO');
    console.log("Izmenjeno");
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
              //alert("Ovo je target");
              this.target = headingLine[j];
              if (isNaN(<any>this.result[0][<any>headingLine[j]]))
                this.parametersService.setProblemType(false);
              else
                this.parametersService.setProblemType(true);
              this.targetService.setTarget(this.target);
            }
        }
      }
        let line: any = Object.values(this.result[i]);
        let rowLine = [];
        for (let j = 0 ; j < line.length; j ++) {
          console.log(line[j]);
            if (!(isNaN(<any>line[j])))
              line[j] = Number(line[j]);
            rowLine.push(line[j]);
        }
        console.log(rowLine);
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

    this.parametersService.setInputs(this.inputs);
    this.allDataCopy1=this.allData;
    this.allDataCopy2=this.allData;
    for(let j=0;j<this.header.length;j++){
      this.searchInput[j]="";
    }

    this.scrollToTable();
  }

  ngOnInit(){
    this.parametersService.setInputs(this.inputs);
  }

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
      {
        this.target = this.header[i];
        if (isNaN(<any>this.result[0][this.header[i]]))
          this.parametersService.setProblemType(false);
        else
          this.parametersService.setProblemType(true);
        //alert("Izmenjen target!");
        this.targetService.setTarget(this.target);
      }
    }
    for (let i = 0; i < this.inputs.length; i++) {
      if (i != 0) 
        this.hp = this.hp.concat(',' + this.inputs[i]);
      else
        this.hp = this.hp.concat(this.inputs[i]);
    }
    //provera da li ima bar jedan target setovan
    var ind = 0;
    for (let i = 0; i < this.preload.length; i++) {
      
      if (this.preload[i] === 'target'){
        //alert("Nadjen target")
        //ako je bar jedan target, onda je sve ok
        ind = 1;
      }
    }
    if (ind===0){
      //nema targeta
      //alert("Nema targeta");
      this.targetService.setTarget("");
    }
    
    this.hp = this.hp.concat(',' + this.target);
    this.parametersService.setParamsObs(this.hp);
    this.parametersService.setInputs(this.inputs);
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


  sortTableAsc(item: any) {
    for(let i = 0; i < this.allData.length - 1; i++){
      for (let j = i + 1; j < this.allData.length; j++) {
        if (this.allData[i][item] > this.allData[j][item]) {
          const t = this.allData[i];
          this.allData[i] = this.allData[j];
          this.allData[j] = t;
        }
      }
    }
    this.changePage();
  }

  sortTableDesc(item: any) {
    for(let i = 0; i < this.allData.length - 1; i++){
      for (let j = i + 1; j < this.allData.length; j++) {
        if (this.allData[i][item] < this.allData[j][item]) {
          const t = this.allData[i];
          this.allData[i] = this.allData[j];
          this.allData[j] = t;
        }
      }
    }
    this.changePage();
  }  

  searchTable(index:number)
  {
    this.allDataCopy1=this.allDataCopy2;
    for(let j=0;j<this.header.length;j++)
    {
      this.searchData=[];
      if(this.searchInput[j]!=""){      
        
        for(let i = 0; i < this.allDataCopy1.length ; i++){
          if(this.allDataCopy1[i][j].toString().toLowerCase().indexOf(this.searchInput[j].toLowerCase())!=-1)
            this.searchData.push(this.allDataCopy1[i])
        }
        this.allDataCopy1=this.searchData;
      //  console.log("Idemo1");
     //   console.log(this.allDataCopy1);
      }

    }
   // console.log("Idemo2");
  //  console.log(this.allDataCopy1);
    this.allData=this.allDataCopy1;
    this.dataLength=this.allData.length;
    this.changePage();  
  }
  obrisi(i:any)
  {
    this.searchInput[i]="";
    this.searchTable(i);
  }
}

