import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegistracijaService } from './registracija.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private registracijaService: RegistracijaService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;
    const username = form.value.username;
    const password = form.value.password;

    this.registracijaService.signUp(firstname, lastname, username, password).subscribe(resData => {
      console.log(resData);
    }, error => {
      console.log(error);
    });
    form.reset();
  }
}
