import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EmailValidator } from "@angular/forms";

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

    signUp(firstname: string, lastname: string, email:string, username: string, password: string) {
       return this.http.post<AuthResponseData>('https://localhost:7167/api/RegistracijaUsera', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
        });
    }
}