import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CsvComponent } from 'src/app/home/csv/csv.component';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  
  map:Map<string, string[]>;
  array2d: string[][]; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    
    this.http.get<any>('https://localhost:7167/api/Python/csv').subscribe(result => {
    

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
    
  });
 
  }

  personImg:string="assets/images/person.jpg";

}
