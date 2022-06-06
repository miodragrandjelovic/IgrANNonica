import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from 'src/app/_model/user.model';
import * as myUrls from 'src/app/urls';
import { Router } from '@angular/router'
import { Toast, ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient, private router:Router, private toastr:ToastrService) { }

  public url = myUrls.url;
  updateProfile(user:User) : Observable<User> {

    return this.http.put<User>(this.url + '/api/RegistracijaUsera/username' , {
        userId: user.userId,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt}, {responseType:'text' as 'json'});
 }

 
 get(){
  return sessionStorage.getItem('username');
  
}

user:any=false;
deleteAccount() 
{
  this.user=this.get();
  this.http.delete<any>(this.url +'/api/RegistracijaUsera/username?username='+this.user, {responseType:'text' as 'json'}).subscribe(result => {
   
    this.router.navigate(['/']);
    this.toastr.success("You've successfully deleted your account!","Account Deleted");
  }, error=>{
    this.toastr.error("Your account is not deleted, sorry, try again!", "Account Not Deleted");
  });
}


}
