import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CsvComponent } from 'src/app/home/csv/csv.component';
import { DatasetService } from './dataset.service';
import * as myUrls from 'src/app/urls';
@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  
  map:Map<string, string[]>;
  array2d: string[][]; 
  datasetsNames: any;

  constructor(private http: HttpClient,
    private datasets:DatasetService) { }
    public url = myUrls.url;

  ngOnInit(): void {
    var loggedUsername = sessionStorage.getItem('username');
        this.http.get<any>(this.url + '/api/Python/savedCsvs?Username='+loggedUsername).subscribe(result => {  //uzima nazive svih datasetova od ulogovanog korisnika
            //console.log(result);
            this.datasetsNames=result;
           // console.log(this.datasetsNames);
        });
    

  /*  this.http.get<any>('https://localhost:7167/api/Python/csv').subscribe(result => { //ispisuje u tabel csv 

    var map = new Map<string, string[]>();
    
    for(var i = 0; i < result.length; i++) {
      if(i == 0) {
        var aaa = Object.keys(result[i]);
        for(var j = 0; j < aaa.length; j++) {
          map.set(aaa[j], ["" + Object.values(result[i])[j]]);
        }
      } else {
        var aaa = Object.keys(result[i]);
        for(var j = 0; j < aaa.length; j++) {
          var array = map.get(aaa[j]);
          if(array == undefined) array = [];
          array.push("" + Object.values(result[i])[j]);
          map.set(aaa[j], array);
        }
      }
    }
    console.log(map);
    this.map=map;
    this.array2d=Array.from(map.values());

    this.array2d= this.array2d[0].map((_, colIndex) =>this.array2d.map(row => row[colIndex]));
  });*/

  }

  selectedValue:any="";

    selectChange(event:any){

        this.selectedValue=event.target.id;
       // console.log('ovo je kliknuto za naziv '+this.selectedValue);
        this.posaljiNaziv(this.selectedValue);
    }
    
  posaljiNaziv(naziv:any){
    var loggedUsername = sessionStorage.getItem('username');
    return this.http.post<any>(this.url + '/api/LoadData/selectedCsv?name='+naziv+'&Username='+loggedUsername, {
        name: naziv
      }).subscribe(result=>{
        
      //  console.log(result);
        var map = new Map<string, string[]>();
    
        for(var i = 0; i < result.length; i++) {
          if(i == 0) {
            var aaa = Object.keys(result[i]);
            for(var j = 0; j < aaa.length; j++) {
              map.set(aaa[j], ["" + Object.values(result[i])[j]]);
            }
          } else {
            var aaa = Object.keys(result[i]);
            for(var j = 0; j < aaa.length; j++) {
              var array = map.get(aaa[j]);
              if(array == undefined) array = [];
              array.push("" + Object.values(result[i])[j]);
              map.set(aaa[j], array);
            }
          }
        }
      //  console.log(map);
        this.map=map;
        this.array2d=Array.from(map.values());
    
        this.array2d= this.array2d[0].map((_, colIndex) =>this.array2d.map(row => row[colIndex]));
      });
    }
   

  

  personImg:string="assets/images/person.jpg";

}
