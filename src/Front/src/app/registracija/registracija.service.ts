import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EmailValidator } from "@angular/forms";
import * as myUrls from 'src/app/urls';
interface AuthResponseData {
    firstname: string,
    lastname: string,
    email:string,
    username: string,
    password: string
}

@Injectable({providedIn: 'root'})
export class RegistracijaService {

    constructor(private http: HttpClient) {
    }
    public url = myUrls.url;
    signUp(firstname: string, lastname: string, email:string, username: string, password: string) {
       return this.http.post<AuthResponseData>(this.url + '/api/RegistracijaUsera', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
        });
    }
}