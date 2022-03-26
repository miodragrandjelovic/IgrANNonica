import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm,Validators } from '@angular/forms';
import { PrijavaService } from '../prijava/./prijava.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RegistracijaService } from '../registracija/./registracija.service';
import { Router } from '@angular/router';
import { User } from '../_model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  closeResult: string | undefined;

  ulogovanUser: User=new User();

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private prijavaService: PrijavaService,
    private registracijaService: RegistracijaService,
    private router:Router,
    ) { }

    registerForm:any;
    loggedUser:string='';
    
  ngOnInit(): void {
    this.registerForm=new FormGroup({
      "firstname":new FormControl(null,[Validators.required,Validators.pattern('[a-zA-Z]*')]),
      "lastname":new FormControl(null,[Validators.required,Validators.pattern('[a-zA-Z]*')]),
      "email":new FormControl(null,[Validators.email]),
      "username":new FormControl(null,[Validators.required]),
      "password":new FormControl(null,[Validators.required])
    });
  }

  showMe:boolean=false;
  showMe2:boolean=true;

  onSubmit(form: NgForm) {
    this.showMe=true;
    this.showMe2=false;
    
    if (!form.valid) {
      return;
    }
     
    const username = form.value.username;
    const password = form.value.password;
    localStorage.setItem("username",username);
    this.loggedUser=form.value.username;
    this.router.navigate(['/home']);

    this.prijavaService.logIn(username, password).subscribe(resData => {
      console.log(resData);
      this.prijavaService.getUserByUsername(localStorage.getItem("username")).subscribe(data=>{
        this.ulogovanUser=data;
        console.log(data);
      })
    }, error => {
      
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
    }, error => {
      console.log(error);
    });
    this.registerForm.reset();
  }

  get firstname(){return this.registerForm.get('firstname');}
  get lastname(){return this.registerForm.get('lastname');}
  get email(){return this.registerForm.get('email');}
  get username(){return this.registerForm.get('username');}
  get password(){return this.registerForm.get('password');}


  openRegister(contentRegister: any) {
    this.modalService.open(contentRegister, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLogin(contentLogin: any) {
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

  onLogOut()
  {
    this.showMe=false;
    this.showMe2=true;
    localStorage.removeItem("username");
    this.router.navigate(['/']);
  }

}
