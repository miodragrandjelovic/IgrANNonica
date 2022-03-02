import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddEditInspectionComponent } from './inspection/add-edit-inspection/add-edit-inspection.component';

@Injectable({
  providedIn: 'root'
})
export class InspectionApiService {

  readonly inspectionAPIUrl = "https://localhost:7172/api"
  constructor(private http:HttpClient) { }

  //Predmet

  getPredmetList(): Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/Predmets');
  }

  addPredmet(data:any){
    return this.http.post(this.inspectionAPIUrl + '/Predmets', data);
  }

  updatePredmet(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/Predmets/${id}`, data);
  }

  deletePredmet(id:number|string){
    return this.http.delete(this.inspectionAPIUrl + `/Predmets/${id}`);
  }

  //ImePredmeta
  getImePredmetasList(): Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/ImePredmetas');
  }

  addImePredmetas(data:any){
    return this.http.post(this.inspectionAPIUrl + '/ImePredmetas', data);
  }

  updateImePredmetas(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/ImePredmetas/${id}`, data);
  }

  deleteImePredmetas(id:number|string, data:any){
    return this.http.delete(this.inspectionAPIUrl + `/ImePredmetas/${id}`);
  }

  //Status
  getStatusList(): Observable<any[]>{
    return this.http.get<any>(this.inspectionAPIUrl + '/Status');
  }

  addStatus(data:any){
    return this.http.post(this.inspectionAPIUrl + '/Status', data);
  }

  updateStatus(id:number|string, data:any){
    return this.http.put(this.inspectionAPIUrl + `/Status/${id}`, data);
  }

  deleteStatus(id:number|string, data:any){
    return this.http.delete(this.inspectionAPIUrl + `/Status/${id}`);
  }
  
}