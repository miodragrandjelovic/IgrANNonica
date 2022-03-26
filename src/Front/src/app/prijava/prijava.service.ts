import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_model/user.model";
import { Subscription } from 'rxjs';

interface AuthResponseData {
    token: string;
}

@Injectable({providedIn: 'root'})
export class PrijavaService {

    constructor(private http: HttpClient) {

    }

    logIn(username: string, password: string) {
        return this.http.post('https://localhost:7167/api/RegistracijaUsera/login', {
            username: username,
            password: password
        });
    }

    getUserByUsername(username:any) : Observable<User>
    {
       return this.http.get<User>('https://localhost:7167/api/RegistracijaUsera/username?username='+username);
    }
}