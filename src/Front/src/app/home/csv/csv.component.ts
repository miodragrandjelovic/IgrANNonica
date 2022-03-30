import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})
export class CsvComponent {


    showMe: boolean = false;
    showMe2:boolean = false;
    showMe3:boolean = false;
    selectedValue:any="";

    selectChange(event:any){
        this.showMe2=true;
        this.selectedValue=event.target.value;
    }
    
    dataObject:any = [];
    headingLines: any = [];
    rowLines: any = [];
    allData: any = [];
    itemsPerPage: number = 10;
    itemPosition: number = 0;
    currentPage: number = 1;
    response: any;

    headersStatistics: any = [['Name', 'Q1', 'Q2', 'Q3', 'count', 'freq', 'max', 'mean', 'min', 'std', 'top', 'unique']];
    rowLinesStatistics: any = [];

    headersMatrix: any = [];
    rowLinesMatrix:any = [];

    flag: number = 0;

    headers: any;

    constructor(private http: HttpClient) {

    }


    fileUpload(files: any) {
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
                    csvData: JSON.stringify(this.dataObject)
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
    