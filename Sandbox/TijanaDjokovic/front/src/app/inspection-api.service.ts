import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionApiService {

  readonly inspectionAPIUrl = "https://localhost:7069/api";

  constructor(private http: HttpClient) { }

  //METODI ZA INSPEKCIJE
  //metod za izlistavanja inspekcija
  getInspectionsList():Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/inspections');
  }

  //metod za dodavanje inspekcija
  addInspection(data:any){
    return this.http.post(this.inspectionAPIUrl + '/inspections', data);
  } 

  //metod za apdejt inspekcija
  updateInspection(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/inspections/${id}`, data);
  }

  //metod za brisanje inspekcija
  deleteInspection(id:number|string){
    return this.http.delete(this.inspectionAPIUrl + `/inspections/${id}`);
  }

  //METODI ZA TIP INSPEKCIJE
  //metod za izlistavanja tipova inspekcija
  getInspectionTypesList():Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/inspectiontypes');
  }

  //metod za dodavanje tipova inspekcija
  addInspectionTypes(data:any){
    return this.http.post(this.inspectionAPIUrl + '/inspectiontypes', data);
  } 

  //metod za apdejt tipova inspekcija
  updateInspectionTypes(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/inspectiontypes/${id}`, data);
  }

  //metod za brisanje tipova inspekcija
  deleteInspectionTypes(id:number|string){
    return this.http.delete(this.inspectionAPIUrl + `/inspectiontypes/${id}`);
  }

  //METODI ZA STATUSE
  //metod za izlistavanja statusa
  getStatusList():Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/status');
  }

  //metod za dodavanje statusa
  addStatus(data:any){
    return this.http.post(this.inspectionAPIUrl + '/status', data);
  } 

  //metod za apdejt statusa
  updateStatus(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/status/${id}`, data);
  }

  //metod za brisanje statusa
  deleteStatus(id:number|string){
    return this.http.delete(this.inspectionAPIUrl + `/status/${id}`);
  }
}
