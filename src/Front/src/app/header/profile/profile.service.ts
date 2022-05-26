import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from 'src/app/_model/user.model';
import * as myUrls from 'src/app/urls';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public url = myUrls.url;
  updateProfile(user:User) : Observable<User> {
  //  console.log(this.url)
    return this.http.put<User>(this.url + '/api/RegistracijaUsera/username', {
        userId: user.userId,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
     });
 }

 
 get(){
  return sessionStorage.getItem('username');
  
}

user:any=false;
deleteAccount() 
{
  this.user=this.get();
  this.http.delete<any>(this.url +'/api/RegistracijaUsera/username?username='+this.user).subscribe(result => { 
  //  console.log(result);
   });
}


}
