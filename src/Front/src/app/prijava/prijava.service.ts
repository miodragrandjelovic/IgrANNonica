import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_model/user.model";
import { Subscription } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";

interface AuthResponseData {
    token: string;
}

const jwtHelper=new JwtHelperService()

@Injectable({providedIn: 'root'})
export class PrijavaService {

    constructor(private http: HttpClient,
        private cookie:CookieService) {

    }

    logIn(username: string, password: string) : Observable<string> 
    {
        return this.http.post<string>('https://localhost:7167/api/RegistracijaUsera/login', {
            username: username,
            password: password
        });
    }

    isAuthenticated() : boolean
    {
        if(this.cookie.check('token'))
        {
            var token=this.cookie.get('token');

            return !jwtHelper.isTokenExpired(token);
        }
        return false;
    }

    getUserByUsername(username:any) : Observable<User>
    {
       return this.http.get<User>('https://localhost:7167/api/RegistracijaUsera/username?username='+username);
    }
}