import { Component, OnInit , Output, EventEmitter, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from 'src/app/services/parameters.service';
import * as myUrls from 'src/app/urls';
import { CsvComponent } from '../csv.component';
interface zapamceniDatasetovi {
  name: String,
  size: number,
  date: Date
}



@Component({
  selector: 'app-userdatasets',
  templateUrl: './userdatasets.component.html',
  styleUrls: ['./userdatasets.component.css']
})

export class UserdatasetsComponent implements OnInit {

  @Output() sendResults = new EventEmitter<{datasetName:any,dataset:any,kor:any,stat:any}>();
  //ovim saljemo nazad ka csv komponenti dataset 
  zapamceniDatasetovi: any= [];

  @Output() search:EventEmitter<string>=new EventEmitter();
  @Input() search1:string;

  constructor(private http: HttpClient, private parametersService: ParametersService){}
  public url = myUrls.url;
  datasetsNames: any;
  selectedDataset:any;
  datasetsFilteredNames : any = [];
  copyPaste:any = [];

  zapamceniDatasetoviPublic: any= [];
  datasetsNamesPublic: any;
  selectedDatasetPublic:any;
  datasetsFilteredNamesPublic : any = [];
  copyPastePublic:any = [];

  privateOrPublicSet:number=1;

  ngOnInit(): void {
    //this.zapamceniDatasetovi = [];
    //this.zapamceniDatasetoviPublic = [];
    if (this.privateOrPublicSet == 1)
      this.getDatasets();
    else 
      this.getPublicDatasets();
    /*this.parametersService.getDatasets().subscribe(res => {
      this.getDatasets();
    });*/
  }

  
  changeDatasets(index:number)
  {
    this.privateOrPublicSet = index;
    this.search.emit();
    this.ngOnInit();
  }

  getDatasets()
  {
    this.zapamceniDatasetovi = [];
    this.zapamceniDatasetoviPublic = [];
    this.copyPaste = [];
    this.copyPastePublic = [];
    this.datasetsNames = [];
    this.datasetsNamesPublic = [];
    this.datasetsFilteredNames = [];
    this.datasetsFilteredNamesPublic = [];

    this.http.get<any>(this.url + '/api/Python/savedCsvs').subscribe(result => {  
            console.log(result);
            this.copyPaste=result;
            console.log(this.copyPaste);
           /*
            this.copyPaste.push("prva1");
            this.copyPaste.push("prva2");
            this.copyPaste.push("prva3");
            this.copyPaste.push("prva4");
            this.copyPaste.push("prva5");
            this.copyPaste.push("prva5");
 
            */
            this.datasetsNames = this.copyPaste;
            this.zapamceniDatasetovi = result;
        });

        this.selectedDataset = '';
  }

  

  getPublicDatasets()
  {
    this.zapamceniDatasetovi = [];
    this.zapamceniDatasetoviPublic = [];
    this.copyPaste = [];
    this.copyPastePublic = [];
    this.datasetsNames = [];
    this.datasetsNamesPublic = [];
    this.datasetsFilteredNames = [];
    this.datasetsFilteredNamesPublic = [];
    
    this.http.get<any>(this.url + '/api/Python/publicDatasets').subscribe(result => {  
            console.log(result);
            this.copyPastePublic=result;
            console.log(this.copyPastePublic);
           /*
            this.copyPaste.push("prva1");
            this.copyPaste.push("prva2");
            this.copyPaste.push("prva3");
            this.copyPaste.push("prva4");
            this.copyPaste.push("prva5");
            this.copyPaste.push("prva5");
 
            */
            this.datasetsNamesPublic = this.copyPastePublic;
            this.zapamceniDatasetoviPublic = result;
        });

        //this.selectedDataset = '';
        
  }

//////////////
/*
  searchDatasets(name:any){
    this.datasetsFilteredNames = [];
    this.zapamceniDatasetovi = this.copyPaste;
    if(name != ""){
    for (var index = 0; index < this.zapamceniDatasetovi.length; index++) {
      if(this.zapamceniDatasetovi[index].name.toLowerCase().indexOf(name.toLowerCase()) !== -1){
        this.datasetsFilteredNames.push(this.zapamceniDatasetovi[index]);
      }  
    }

    this.zapamceniDatasetovi = this.datasetsFilteredNames;
   }

   this.datasetsFilteredNamesPublic=[];
   this.zapamceniDatasetoviPublic = this.copyPastePublic;
   if(name != ""){
    for (var index = 0; index < this.zapamceniDatasetoviPublic.length; index++) {
      if(this.zapamceniDatasetoviPublic[index].name.toLowerCase().indexOf(name.toLowerCase()) !== -1){
        this.datasetsFilteredNamesPublic.push(this.zapamceniDatasetoviPublic[index]);
      }  
    }

    this.zapamceniDatasetoviPublic = this.datasetsFilteredNamesPublic;
   }

   console.log("idemooooooo "+this.search1);
  }
*/
  selectChange(event:any){
    this.selectedDataset=event.target.id;
    //alert("NAZIV JE "+ this.selectedDataset);
    console.log('ovo je kliknuto za naziv '+this.selectedDataset);
    //alert(this.selectedDataset);
    this.loadThisDataset(this.selectedDataset);
    // takodje da se u csv komponenti ispise naziv selektovanog fajla
  }

  selectChangePublic(event:any){
    this.selectedDataset=event.target.id;
    //alert("NAZIV JE "+ this.selectedDataset);
    console.log('ovo je kliknuto za naziv '+this.selectedDataset);
    //alert(this.selectedDataset);
    this.loadThisDatasetPublic(this.selectedDataset);
    // takodje da se u csv komponenti ispise naziv selektovanog fajla
  }

  downloadDataset(event:any){
    this.selectedDataset=event.target.id;
    alert("DOWNLOAD DATASET "+ this.selectedDataset);
    event.stopPropagation();
  }

  deleteDatasetCsv:any;

  deleteDataset(event:any){
    this.deleteDatasetCsv=event.target.id;
    //alert("DELETE DATSET "+ this.deleteDatasetCsv);

    this.http.delete<any>(this.url +'/api/RegistracijaUsera/csv?name='+this.deleteDatasetCsv).subscribe(result => { 
      console.log("Uspesno obrisan "+result);
      //alert("Uspesno obrisan" + result);
      this.ngOnInit();
     },(err)=>{
      console.log("Greska prilikom brisanja" + err);
      //alert("Greska prilikom brisanja!" + err);
      this.ngOnInit();
     });
    
    this.deleteDatasetCsv = "";
    event.stopPropagation();

    this.ngOnInit();
    //da se uradi refresh tabele 
  }

  deletePublicDataset(event:any){
    this.deleteDatasetCsv=event.target.id;
    //alert("DELETE DATSET "+ this.deleteDatasetCsv);

    //ovde treba da se izmeni endpoint kad Vukas napravi, da gadja public datasetove
    this.http.delete<any>(this.url +'/api/RegistracijaUsera/csv?name='+this.deleteDatasetCsv).subscribe(result => { 
      console.log(result);

      this.ngOnInit();
     }, (err)=>{
       console.log("Greska prilikom brisanja javnog "+err);
       this.ngOnInit();
     });
    
    this.deleteDatasetCsv = "";
    event.stopPropagation();

    this.ngOnInit();
    //da se uradi refresh tabele 
  }

  loadThisDataset(naziv:any){

    // !! POSLE OVOG ZATEVA, POTREBNO JE PROSLEDITI I ZAHTEV ZA KORELACIONU MATRICU!!!
    return this.http.post<any>(this.url + '/api/LoadData/selectedCsv?name='+naziv, {
        name: naziv
      }).subscribe(selectedDatasetUser=>{
        
        console.log(selectedDatasetUser);
        this.http.get<any>(this.url + '/api/Python/kor').subscribe(data =>{
            console.log('ovo je za kor: '+data);
          
          this.http.get<any>(this.url + '/api/Python/stats').subscribe(result =>{
            console.log('ovo je za stat: '+result);
           
            this.sendResults.emit({datasetName:naziv,dataset:selectedDatasetUser,kor:data,stat:result});
          });
          
        });

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

  loadThisDatasetPublic(naziv:any){

      // !! POSLE OVOG ZATEVA, POTREBNO JE PROSLEDITI I ZAHTEV ZA KORELACIONU MATRICU!!!
      // ovde treba da se promeni endpoint kad Vukas napravi, za selektovan PUBLIC dataset
      return this.http.post<any>(this.url + '/api/LoadData/publicCsv?name='+naziv, {
          name: naziv
        }).subscribe(selectedDatasetUser=>{
          
          console.log(selectedDatasetUser);
          this.http.get<any>(this.url + '/api/Python/kor').subscribe(data =>{
              console.log('ovo je za kor: '+data);
            
            this.http.get<any>(this.url + '/api/Python/stats').subscribe(result =>{
              console.log('ovo je za stat: '+result);
             
              this.sendResults.emit({datasetName:naziv,dataset:selectedDatasetUser,kor:data,stat:result});
            });
            
          });
  
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


