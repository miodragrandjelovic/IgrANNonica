import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { ParametersService } from "src/app/services/parameters.service";


interface CheckBox {
    id: number,
    label: String,
    isChecked: boolean
}

@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})


export class CsvComponent implements OnInit {    

    hidden: boolean;

    showMe: boolean = false;
    showMe2:boolean = false;
    showMe3:boolean = false;
    selectedValue:any="";

    selectChange(event:any){
        this.showMe2=true;
        if (this.selectedValue != event.target.value) {
            this.selectedValue=event.target.value;
            this.sendHp = this.sendHp.concat(',' + this.selectedValue);
        }
        console.log(this.sendHp);
    }
    
    dataObject:any = [];
    headingLines: any = [];
    rowLines: any = [];
    allData: any = [];
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
        })
    }

    constructor(private http: HttpClient, private parametersService: ParametersService) {

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

        console.log(this.selectedInputs);
        console.log(this.outputs);
        for (let i = 0; i < this.selectedInputs.length; i++) {
            const str = this.selectedInputs[i].label;
            if (i != 0) {
               this.sendHp = this.sendHp.concat("," + str);
            }
            else
                this.sendHp = this.sendHp.concat('' + str);
        }
        console.log(this.sendHp);
        this.selectedValue = "";
    }

    showHp() {
        this.parametersService.setShowHp(true);
        this.parametersService.setParamsObs(this.sendHp);
    }

    fileUpload(files: any) {
        this.sendHp = '';

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
            console.log(file.name);

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
                console.log(this.sendHp);


                

                let rowsArray = [];

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
                    rowsArray.push(rows[j]);
                }
                this.rowLines = rowsArray.slice(0, this.itemsPerPage);
                this.allData = rowsArray;
                
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
        this.showMe3 = true;
        let headersArray:any = ['Columns'];
        for (let k = 0; k < this.headers.length; k++)
            headersArray.push(this.headers[k]);
        this.http.get<any>('https://localhost:7167/api/Python/kor').subscribe(result => {
            console.log(result);
            let currentRow: any = [];
            for (let i = 0; i < this.headers.length; i++) {
                currentRow = [this.headers[i]];
                for (let j = 0; j < this.headers.length; j++) {
                    currentRow.push(result[this.headers[i]][this.headers[j]]);
                }
                this.rowLinesMatrix.push(currentRow);
            }
         });
            this.headersMatrix.push(headersArray);
    }
}