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
      //console.log(data);
    })
  }

  isMail(mail:string){
    var find : boolean;
    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  
    find = regexp.test(mail);

    return find;
  }

  onUpdate(form: NgForm)
  {
    if (!form.valid) {
      return;
    }

    //provera da li je prazan str neko polje
    if (this.ulogovanUser.firstName == "" || this.ulogovanUser.lastName=="" || this.ulogovanUser.email=="")
    {
      //prazno neko od polja
      this.toastr.error("All fields are required!", "User Update");
    }
    else{
      //provera mejla
      if(!this.isMail(this.ulogovanUser.email)){
        //neispravan format mejla
        this.toastr.error("You must enter valid mail format!", "User Update");
      }
      else{
        //sve ispravno, moze da se menja
        this.profilService.updateProfile(this.ulogovanUser).subscribe(data=>{
          //console.log(data);
          this.toastr.success('Updated successfully', 'Users update');
        }, error=>{
          this.toastr.error('Profile is not updated!', 'Users update');
        });

      }
    }
  }

  onDeleteAccount(){
    this.profilService.deleteAccount();
    this.cookie.deleteAll();
    sessionStorage.clear();
    this.profilService.user=true;
    this.prijavaService.logout();
  }

  personImg:string="assets/images/person.jpg";
}
