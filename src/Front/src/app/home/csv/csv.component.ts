import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

const headers = new HttpHeaders().set('content-type','application/x-www-form-urlencoded');
@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})
export class CsvComponent {

    showMe:boolean=false;
    showMe2:boolean=false;
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

    flag: number = 0;


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
                
                let headers = allTextLines[0].split(/;|,/).map((x:string) => x.trim());
                let data = headers;
                let headersArray = [];

                for (let i = 0; i < headers.length; i++) {
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
                    
                    for(let i = 0; i < headers.length; i++){
                        console.log(result[headers[i]]);
                        const currentRow = [headers[i],
                            result[headers[i]].Q1 ? result[headers[i]].Q1 : 'null',
                            result[headers[i]].Q2 ? result[headers[i]].Q2 : 'null', 
                            result[headers[i]].Q3 ? result[headers[i]].Q3 : 'null', 
                            result[headers[i]].count ? result[headers[i]].count : 'null',
                            result[headers[i]].freq ? result[headers[i]].freq : 'null', 
                            result[headers[i]].max ? result[headers[i]].max : 'null', 
                            result[headers[i]].mean ? result[headers[i]].mean : 'null', 
                            result[headers[i]].min ? result[headers[i]].min : 'null', 
                            result[headers[i]].std ? result[headers[i]].std : 'null', 
                            result[headers[i]].top ? result[headers[i]].top : 'null', 
                            result[headers[i]].unique ? result[headers[i]].unique : 'null'
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
}