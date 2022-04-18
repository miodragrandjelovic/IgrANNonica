import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { ParametersService } from "src/app/services/parameters.service";


interface CheckBox {
    id: number,
    label: String,
    isChecked: boolean
}
import { PreloadCsv, PreloadStatistic } from "src/app/_model/preload.model";
import { Observable } from "rxjs";
import { MessageService } from "../home.service";

@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})


export class CsvComponent implements OnInit {    

    hidden: boolean;

    showMe: boolean = false;
    showMe2:boolean = false;
    showMe3:boolean = false;
    
    showMeMatrix: boolean = false;
    prikazPreucitano:boolean = false;
    odabrano:boolean=false;

    selectedValue:any="";
    selectedValue1:any="";
    
    selectChange(event:any){
        this.changeSelection();
        this.showMe2=true;
        if (this.selectedValue != event.target.value) {
            this.selectedValue=event.target.value;
            this.sendHp = this.sendHp.concat(',' + this.selectedValue);
        }
    }
    selectChange1(event:any){
        this.odabrano=true;
        this.selectedValue1=event.target.value;
    }

    dataObject:any = [];
    headingLines: any = [];
    rowLines: any = [];
    allData: any = [];
    rowsArray: any = [];
    matrix: any = [];
    itemsPerPage: number = 10;
    itemPosition: number = 0;
    currentPage: number = 1;
    response: any;

    headersStatistics: any = [['Columns', 'Q1', 'Q2', 'Q3', 'count', 'freq', 'max', 'mean', 'min', 'std', 'top', 'unique']];
    rowLinesStatistics: any = [];

    headersMatrix: any = [];
    rowLinesMatrix:any = [];

    flag: number = 0;

    headers: any;

    outputs: Array<CheckBox> = [];
    selectedInputs: Array<CheckBox> = [];
    inputsArray: Array<CheckBox> = [];
    sendHp: string = "";
    
    ngOnInit(): void {
        this.parametersService.getShowHp().subscribe(res => {
            this.hidden = res;
        }),
        this.service.messageSubject.subscribe({
            next: x => {
                if (x == 0)
                {
                    this.hidden = false;
                }
                else
                {
                    this.hidden = true;
                    this.showHp();
                }
            }
        })
    }

    constructor(private http: HttpClient, private parametersService: ParametersService, private service: MessageService) {

    }



    fetchSelectedItems() {
        this.selectedInputs = this.inputsArray.filter((value, index) => {
          return value.isChecked
        })
    }

    fetchOutputs() {
        this.outputs = this.inputsArray.filter((value, index) => {
            return value.isChecked == false
        })
    }

    changeSelection() {
        this.sendHp = "";
        this.fetchSelectedItems();
        this.fetchOutputs();

        for (let i = 0; i < this.selectedInputs.length; i++) {
            const str = this.selectedInputs[i].label;
            if (i != 0) {
               this.sendHp = this.sendHp.concat("," + str);
            }
            else
                this.sendHp = this.sendHp.concat('' + str);
        }
        this.selectedValue = "";
    }

    showHp() {
       // this.parametersService.setShowHp(true);
        this.parametersService.setParamsObs(this.sendHp);
    }

    prikazPreload:boolean=true;

    fileUpload(files: any) {
        this.parametersService.setShowGraphic(false);
        this.prikazPreload=false;

        this.sendHp = '';
        this.showMe2 = true;
        this.showMeMatrix = false;
        this.inputsArray = [];

        this.flag = 1;
        if (this.flag)
            this.showMe=true;

        this.dataObject = [];
        this.headingLines = [];
        this.rowLines = [];
        this.rowLinesStatistics = [];

        let fileList = (<HTMLInputElement>files.target).files;
        if (fileList && fileList.length > 0) {
            let file : File = fileList[0];

            let reader: FileReader =  new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv: any = reader.result;
                let allTextLines = [];
                allTextLines = csv.split('\n');
                
                this.headers = allTextLines[0].split(/;|,/).map((x:string) => x.trim());
                let data = this.headers;
                let headersArray = [];

                for (let i = 0; i < this.headers.length; i++) {
                    headersArray.push(data[i]);
                }
                
                this.headingLines.push(headersArray);

                this.outputs[0] = headersArray[headersArray.length - 1];
                
                this.inputsArray = [];

                for (let i = 0; i < headersArray.length; i++) {
                    
                    let isChecked;
                    let id = i + 1;
                    let label = headersArray[i];
                    if (i != headersArray.length - 1)
                        isChecked = true;
                    else
                        isChecked = false;
                    
                    const myObject: CheckBox = {
                        id: id,
                        label: label,
                        isChecked: isChecked
                    }

                    this.inputsArray.push(myObject);
                }

                this.fetchSelectedItems();
                this.fetchOutputs();

                for (let i = 0; i < this.selectedInputs.length; i++) {
                    const str = this.selectedInputs[i].label;
                    if (i != 0) {
                       this.sendHp = this.sendHp.concat("," + str);
                    }
                    else
                        this.sendHp = this.sendHp.concat('' + str);
                }
                this.selectedValue = this.outputs[0].label;
                this.sendHp = this.sendHp.concat(',' + this.selectedValue);                

                this.rowsArray = [];

                let length = allTextLines.length - 1;
                
                let rows:any = [];
                for (let i = 1; i < length; i++) {
                    rows.push(allTextLines[i].split(/;|,/).map((x:string) => x.trim()));
                    const obj:any = {};
                    headersArray.forEach((header:any, j:any) => {
                        obj[header] = rows[i - 1][j];
                    })
                    this.dataObject.push(obj);
                }
                length = rows.length;
                for (let j = 0; j < length; j++) {
                    this.rowsArray.push(rows[j]);
                }
                this.rowLines = this.rowsArray.slice(0, this.itemsPerPage);
                this.allData = this.rowsArray;
                
                return this.http.post<any>('https://localhost:7167/api/LoadData/csv', {
                    csvData: JSON.stringify(this.dataObject),
                    Name: file.name
                }).subscribe(result => {
                    const allRows = [];
                    for(let i = 0; i < this.headers.length; i++){
                        const currentRow = [this.headers[i],
                            result[this.headers[i]].Q1 ? result[this.headers[i]].Q1 : 'null',
                            result[this.headers[i]].Q2 ? result[this.headers[i]].Q2 : 'null', 
                            result[this.headers[i]].Q3 ? result[this.headers[i]].Q3 : 'null', 
                            result[this.headers[i]].count ? result[this.headers[i]].count : 'null',
                            result[this.headers[i]].freq ? result[this.headers[i]].freq : 'null', 
                            result[this.headers[i]].max ? result[this.headers[i]].max : 'null', 
                            result[this.headers[i]].mean ? result[this.headers[i]].mean : 'null', 
                            result[this.headers[i]].min ? result[this.headers[i]].min : 'null', 
                            result[this.headers[i]].std ? result[this.headers[i]].std : 'null', 
                            result[this.headers[i]].top ? result[this.headers[i]].top : 'null', 
                            result[this.headers[i]].unique ? result[this.headers[i]].unique : 'null'
                        ];
                        this.rowLinesStatistics.push(currentRow);
                    }
                });


            }
        }
    }

    changePage() {
        this.rowLines = this.allData.slice(this.itemsPerPage * (this.currentPage - 1),this.itemsPerPage * (this.currentPage - 1) + this.itemsPerPage)
    }

    korelacionaMatrica() {

        this.showMeMatrix = true;
        this.headersMatrix = [];
        this.rowLinesMatrix = [];
        this.matrix = [];
        this.showMe3 = true;
        let headersArray:any = ['Columns'];
        for (let k = 0; k < this.headers.length; k++) {
            if (!isNaN(this.rowsArray[0][k])) {
                headersArray.push(this.headers[k]);
                this.matrix.push(this.headers[k]);
            }
        }
        this.http.get<any>('https://localhost:7167/api/Python/kor').subscribe(result => {
            let currentRow: any = [];
            for (let i = 0; i < this.matrix.length; i++) {
                currentRow = [this.matrix[i]];
                for (let j = 0; j < this.matrix.length; j++) {
                    currentRow.push(result[this.matrix[i]][this.matrix[j]]);
                }
                this.rowLinesMatrix.push(currentRow);
                }
            });
            this.headersMatrix.push(headersArray);
        }

        //---------------------------------------------------------- preload data
        map:Map<string, string[]>;
        map2:Map<string, string[]>;
        map3:Map<string, string[]>;
        array2d: string[][]; 
        array2d2: string[][];
        array2d3: string[][];
        datasetsNames: any;
        showMe4:boolean=false;
    
        kolona: any = [];
       

        rowLinesStatistics1: any = [];

        preloadCsv()
        {
            this.prikazPreucitano=true;
            this.rowLinesStatistics1 = [];
            this.kolona=[];

            this.showMe4 = true;
            this.http.get<any>('https://localhost:7167/api/Python/preloadCsv').subscribe(result =>{
            console.log(result);
               
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
    
            this.http.get<any>('https://localhost:7167/api/Python/preloadStat').subscribe(data =>{
               
                var map = new Map<string, string[]>();
                var map2 = new Map<string, Map<string, string[]>>();
                var map3 = new Map<string, string[]>();

                for(const p in data) {
                    var array1:any=[];
                   var map:Map<string, string[]>;
                   array1.push(p);
                      for(const a in data[p]) {
                        array1.push(data[p][a])
                        map.set(a,data[p][a]);
                    } 
                    map2.set(p, map);
                    map3.set(p,array1);
                    this.array2d2=Array.from(map3.values());
    
                  } console.log(map2);
                  this.kolona=Array.from(Array.from(map2.entries().next().value[1].keys()));
                  this.kolona.unshift("Colums");
                
            });

        }
        kolona2: any = [];
        prikazKorMat:boolean=false;
        preloadKorelacionaMatrica(){

            this.kolona2=[];
            this.prikazKorMat=true;
            this.http.get<any>('https://localhost:7167/api/Python/preloadKor').subscribe(data =>{
               
                var map = new Map<string, string[]>();
                var map22 = new Map<string, Map<string, string[]>>();
                var map33 = new Map<string, string[]>();

                for(const p in data) {
                    var array11:any=[];
                   var map:Map<string, string[]>;
                   array11.push(p);
                      for(const a in data[p]) {
                        array11.push(data[p][a])
                        map.set(a,data[p][a]);
                    } 
                    map22.set(p, map);
                    map33.set(p,array11);
                    this.array2d3=Array.from(map33.values());
    
                  } console.log(map22);
                  this.kolona2=Array.from(Array.from(map22.entries().next().value[1].keys()));
                  this.kolona2.unshift("Colums");
                
              });     
        }
    }

    
