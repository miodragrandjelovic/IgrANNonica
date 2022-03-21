import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

const headers = new HttpHeaders().set('content-type','application/x-www-form-urlencoded');
@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})
export class CsvComponent {


    dataObject:any = [];
    headingLines: any = [];
    rowLines: any = [];

    constructor(private http: HttpClient) {

    }


    fileUpload(files: any) {

        this.dataObject = [];
        this.headingLines = [];
        this.rowLines = [];

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
                this.rowLines.push(rowsArray);

                return this.http.post<any>('https://localhost:7167/api/LoadData/csv', {
                    csvData: JSON.stringify(this.dataObject)
                }).subscribe();
            }
        }
    }
}