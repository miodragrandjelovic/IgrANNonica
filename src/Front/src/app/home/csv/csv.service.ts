import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreloadCsv } from 'src/app/_model/preload.model';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  getPreloadCsv() : Observable<PreloadCsv>
  {
    return this.http.get<PreloadCsv>('https://localhost:7167/api/Python/preloadCsv',{});

  }
}
