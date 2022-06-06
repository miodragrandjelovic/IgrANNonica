import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as myUrls from 'src/app/urls';
@Injectable({providedIn: 'root'})
export class DatasetService {
    datasetsNames: any;

    constructor(private http: HttpClient) { }
    public url = myUrls.url;
    getDatasets() {     
        var loggedUsername = sessionStorage.getItem('username');
        this.http.get<any>(this.url + '/api/Python/savedCsvs?Username'+loggedUsername).subscribe(result => {
   
            this.datasetsNames=result;
   
        });
    }
}