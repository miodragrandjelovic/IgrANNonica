import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrijavaService } from './prijava.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {
  constructor(private PrijavaService: PrijavaService){}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.PrijavaService.logIn(form.value.username, form.value.password).subscribe(resData => {
      console.log(resData);
    }, error => {
      
    });
    form.reset()
  }

}
