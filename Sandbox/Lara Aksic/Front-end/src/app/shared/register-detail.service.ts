import { Injectable } from '@angular/core';
import { RegisterDetail } from './register-detail.model';
import{HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterDetailService {

  constructor(private http:HttpClient) { }

  formData:RegisterDetail=new RegisterDetail();
  list : RegisterDetail[];

  readonly baseURL='https://localhost:5001/api/RegisterDetail'

  postRegisterDetail(){
    return this.http.post(this.baseURL, this.formData);
  }
  
  putRegisterDetail(){
    return this.http.put(`${this.baseURL}/${this.formData.RegisterId}`, this.formData);
  }

  deleteRegisterDetail(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  refreshList(){
    this.http.get(this.baseURL)
    .toPromise()
    .then(res=>this.list= res as RegisterDetail[]);
  }

 
}
