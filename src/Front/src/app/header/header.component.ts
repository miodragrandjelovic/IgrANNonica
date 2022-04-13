import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm,Validators } from '@angular/forms';
import { PrijavaService } from '../prijava/./prijava.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RegistracijaService } from '../registracija/./registracija.service';
import { Router } from '@angular/router';
import { User } from '../_model/user.model';
import { registerLocaleData } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  closeResult: string | undefined;

  ulogovanUser: User=new User();
  session:any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private prijavaService: PrijavaService,
    private registracijaService: RegistracijaService,
    private router:Router,
    private toastr:ToastrService,
    private cookie: CookieService,
    ) { 
      this.session=this.get();
      this.loggedUser=this.get();
    }

    registerForm:any;
    loggedUser:any;
    message:string='';
    token:any;

    isMenuCollapsed:boolean;

  ngOnInit(): void {
    this.registerForm=new FormGroup({
      "firstname":new FormControl(null,[Validators.required,Validators.pattern('[a-zA-Z]*')]),
      "lastname":new FormControl(null,[Validators.required,Validators.pattern('[a-zA-Z]*')]),
      "email":new FormControl(null,[Validators.required,Validators.email]),
      "username":new FormControl(null,[Validators.required]),
      "password":new FormControl(null,[Validators.required])
    });

    this.isMenuCollapsed = true;
  }


  save(username:string, password:string){
    sessionStorage.setItem('username',username);
    sessionStorage.setItem('password',password);
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    const username = form.value.username;
    const password = form.value.password;
   
    this.prijavaService.logIn(username, password).subscribe(resData => {
      
      this.token=(<any>resData).token;
      this.save(username,password);
      this.cookie.set("token",this.token);
     
      this.session=this.get();
      this.loggedUser=this.get();

      this.selectedIndex = 'homePage';
      
      this.toastr.success('Welcome, '+username, 'User login');
      this.router.navigate(['/home']);
    }, error =>{
      if(error.status==400)
      {
        this.message='Incorect username or password, please try again';
        //alert('Incorect username or password');
        //modal should not close!
        this.toastr.error('Incorrect username or password!', 'User login');
      }
    });
    form.reset()
  }

  onSubmitReg() {
    if (!this.registerForm.valid) {
      return;
    }
    const firstname = this.registerForm.value.firstname;
    const lastname = this.registerForm.value.lastname;
    const email = this.registerForm.value.email;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;

    this.registracijaService.signUp(firstname, lastname, email, username,password).subscribe(resData => {
      console.log(resData);
      this.toastr.success('Sign up successfully', 'Users sign up');
      //log him in
      this.prijavaService.logIn(username, password).subscribe(resData => {
      
        this.token=(<any>resData).token;
        this.save(username,password);
        this.cookie.set("token",this.token);
       
        this.session=this.get();
        this.loggedUser=this.get();
  
        this.selectedIndex = 'homePage';
        
        this.toastr.success('Welcome, '+username, 'User login');
        this.router.navigate(['/home']);
      }, error =>{
        if(error.status==400)
        {
          this.message='Incorect username or password, please try again';
          //alert('Incorect username or password');
          //modal should not close!
          this.toastr.error('We could not log you in! Try again!', 'User login');
        }
      });
    }, error => {
      console.log(error);
      this.toastr.error('Sign up unsuccessful!', 'User sign up');
    });
    this.registerForm.reset();
  }

  get firstname(){return this.registerForm.get('firstname');}
  get lastname(){return this.registerForm.get('lastname');}
  get email(){return this.registerForm.get('email');}
  get username(){return this.registerForm.get('username');}
  get password(){return this.registerForm.get('password');}


  openRegister(contentRegister: any) {
    this.isMenuCollapsed = true;
    this.modalService.open(contentRegister, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLogin(contentLogin: any) {
    this.isMenuCollapsed = true;
    this.modalService.open(contentLogin, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get(){
    return sessionStorage.getItem('username');
    
  }

  onLogOut()
  {
    this.cookie.deleteAll();
    sessionStorage.clear();
    this.session=this.get();
    this.router.navigate(['/']);
    this.selectedIndex = "";
    this.isMenuCollapsed = true;
  }


  selectedIndex: string;
  onSelect(index: string){
    this.selectedIndex = index;
    this.isMenuCollapsed = true;
  }




}
