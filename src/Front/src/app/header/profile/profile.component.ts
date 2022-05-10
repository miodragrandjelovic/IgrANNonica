import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { User } from 'src/app/_model/user.model';
import { HeaderComponent } from '../header.component';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  ulogovanUser: User=new User();
  constructor(private prijavaService: PrijavaService,
    private profilService: ProfileService,
    private toastr:ToastrService,
    private router:Router,
    private cookie: CookieService,) { }
  
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

  onDeleteAccount(){
    this.profilService.deleteAccount();
    this.cookie.deleteAll();
    sessionStorage.clear();
    this.profilService.user=true;
    this.router.navigate(['/']);
    this.prijavaService.logout();
  }

  personImg:string="assets/images/person.jpg";
}
