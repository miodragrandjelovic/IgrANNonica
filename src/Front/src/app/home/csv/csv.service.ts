import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreloadCsv } from 'src/app/_model/preload.model';
import * as myUrls from 'src/app/urls';
@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }
  public url = myUrls.url;
  getPreloadCsv() : Observable<PreloadCsv>
  {
    return this.http.get<PreloadCsv>(this.url + '/api/Python/preloadCsv',{});

  }
}
