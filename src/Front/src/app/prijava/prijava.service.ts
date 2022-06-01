import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_model/user.model";
import { Subscription } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as myUrls from 'src/app/urls';
interface AuthResponseData {
    token: string;
}

const jwtHelper=new JwtHelperService()

@Injectable({providedIn: 'root'})
export class PrijavaService {

    constructor(private http: HttpClient,
        private cookie:CookieService,
        private router:Router,
        private toastr:ToastrService) {

    }
    public url = myUrls.url;
    logIn(username: string, password: string) : Observable<string> 
    {
        return this.http.post<string>(this.url + '/api/RegistracijaUsera/login', {
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
       return this.http.get<User>(this.url + '/api/RegistracijaUsera/username?username='+username);
    }

    logout()
    {
        var loggedUsername = sessionStorage.getItem('username');
        this.http.get<any>(this.url + '/api/RegistracijaUsera/logout?Username='+loggedUsername, {responseType:'text' as 'json'}).subscribe(result => { 
            this.router.navigate(['/home']);
            this.toastr.success("You have successfully been logged out", 'User Logout');

        });
        
    }
    
}
