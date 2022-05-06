import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Urls } from 'src/app/urls';
@Injectable({providedIn: 'root'})
export class DatasetService {
    datasetsNames: any;

    constructor(private http: HttpClient) { }
    private url:Urls
    getDatasets() {     
        this.http.get<any>(this.url + '/api/Python/savedCsvs').subscribe(result => {
            console.log(result);
            this.datasetsNames=result;
            console.log(this.datasetsNames);
        });
    }
}