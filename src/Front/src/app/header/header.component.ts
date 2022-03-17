import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrijavaService } from '../prijava/./prijava.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RegistracijaService } from '../registracija/./registracija.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  closeResult: string | undefined;

 
  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private prijavaService: PrijavaService,
    private registracijaService: RegistracijaService
    ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    this.prijavaService.logIn(username, password).subscribe(resData => {
      console.log(resData);
    }, error => {
      
    });
    form.reset()
  }

  onSubmitReg(form: NgForm) {
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

}
