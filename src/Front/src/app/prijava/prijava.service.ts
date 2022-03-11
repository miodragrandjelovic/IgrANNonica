import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


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
}