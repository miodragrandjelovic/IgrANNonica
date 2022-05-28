import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CsvService {

  datasetname = new Subject<string>();
  name:string;

  setDatasetname(data:string)
  {
    //console.error("SETOVAO SAM IME");
    //alert("Setovano ime na "+data);
    this.name=data;
    this.datasetname.next(data);
  }

  getDatasetName(){
    return this.name;
  }
}
