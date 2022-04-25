import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userdatasets',
  templateUrl: './userdatasets.component.html',
  styleUrls: ['./userdatasets.component.css']
})

export class UserdatasetsComponent implements OnInit {

  @Output() sendResults = new EventEmitter<any>();
  //ovim saljemo nazad ka csv komponenti dataset 

  constructor(private http: HttpClient){}
  datasetsNames: any;
  selectedDataset:any;
  datasetsFilteredNames : any = [];
  copyPaste:any = [];
  ngOnInit(): void {
    this.getDatasets();
  }

  getDatasets()
  {
    this.copyPaste = [];
    this.datasetsNames = [];
    this.datasetsFilteredNames = [];

    this.http.get<any>('https://localhost:7167/api/Python/savedCsvs').subscribe(result => {  //uzima nazive svih datasetova od ulogovanog korisnika
            console.log(result);
            this.copyPaste=result;
            console.log(this.copyPaste);
            this.copyPaste.push("prva1");
            this.copyPaste.push("prva2");
            this.copyPaste.push("prva3");
            this.datasetsNames = this.copyPaste;
        });

      
        this.selectedDataset = '';
  }
//////////////
  searchDatasets(name:any){
    this.datasetsFilteredNames = [];
    this.datasetsNames = this.copyPaste;
    if(name != ""){
    for (var index = 0; index < this.datasetsNames.length; index++) {
      if(this.datasetsNames[index].indexOf(name.toLowerCase()) !== -1){
        this.datasetsFilteredNames.push(this.datasetsNames[index]);
      }  
    }

    this.datasetsNames = this.datasetsFilteredNames;
   }
  }

  selectDataset(event:any){
    this.selectedDataset=event.target.value;
    console.log('ovo je kliknuto za naziv '+this.selectedDataset);
    alert(this.selectedDataset);
    this.loadThisDataset('churn');
}

  loadThisDataset(naziv:any){
    return this.http.post<any>('https://localhost:7167/api/LoadData/selectedCsv?name='+naziv, {
        name: naziv
      }).subscribe(selectedDatasetUser=>{
        
        console.log(selectedDatasetUser);
        //alert("SALJEMO RES");

        this.sendResults.emit(selectedDatasetUser);
        // sada ovo saljemo u tabelu


        /*
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
      
        */
      });
    }
   

  }


