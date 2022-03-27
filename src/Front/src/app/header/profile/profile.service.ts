import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from 'src/app/_model/user.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  updateProfile(user:User) : Observable<User> {
    return this.http.put<User>('https://localhost:7167/api/RegistracijaUsera/username', {
        userId: user.userId,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
     });
 }


}
