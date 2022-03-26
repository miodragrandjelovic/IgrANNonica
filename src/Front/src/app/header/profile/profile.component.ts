import { Component, OnInit } from '@angular/core';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { User } from 'src/app/_model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  ulogovanUser: User=new User();
  constructor(private prijavaService: PrijavaService,) { }

  ngOnInit(): void {
    this.prijavaService.getUserByUsername(localStorage.getItem("username")).subscribe(data=>{
      this.ulogovanUser=data;
      console.log(data);
    })
  }
  
  personImg:string="assets/images/person.jpg";
}
