import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { User } from 'src/app/_model/user.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  ulogovanUser: User=new User();
  constructor(private prijavaService: PrijavaService,
    private profilService: ProfileService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.prijavaService.getUserByUsername(sessionStorage.getItem("username")).subscribe(data=>{
      this.ulogovanUser=data;
      console.log(data);
    })
  }

  onUpdate(form: NgForm)
  {
    if (!form.valid) {
      return;
    }

    this.profilService.updateProfile(this.ulogovanUser).subscribe(data=>{
      console.log(data);
      this.toastr.success('Updated successfully', 'Users update');
    }, error=>{
      console.log('Update error');
    });
  }




  personImg:string="assets/images/person.jpg";
}
