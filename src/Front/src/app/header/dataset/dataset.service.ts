import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class DatasetService {
    datasetsNames: any;

    constructor(private http: HttpClient) {
    }

    getDatasets() {     
        this.http.get<any>('https://localhost:7167/api/Python/savedCsvs').subscribe(result => {
            console.log(result);
            this.datasetsNames=result;
            console.log(this.datasetsNames);
        });
    }
}