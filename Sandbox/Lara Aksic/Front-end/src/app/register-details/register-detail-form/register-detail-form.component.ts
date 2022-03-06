import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterDetail } from 'src/app/shared/register-detail.model';
import { RegisterDetailService } from 'src/app/shared/register-detail.service';

@Component({
  selector: 'app-register-detail-form',
  templateUrl: './register-detail-form.component.html',
  styles: [
  ]
})
export class RegisterDetailFormComponent implements OnInit {

  constructor(public service:RegisterDetailService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    if(this.service.formData.RegisterId==0)
      this.insertRecord(form);
    else 
      this.updateRecord(form);
  }

  insertRecord(form:NgForm){
    this.service.postRegisterDetail().subscribe(
      res=>{
          this.resetForm(form);
          this.service.refreshList();
          this.toastr.success('Submited successfully','Subject Detail Register')
        },
        err=>{console.log(err);}
    );
  }

  updateRecord(form:NgForm){
    this.service.putRegisterDetail().subscribe(
      res=>{
          this.resetForm(form);
          this.service.refreshList();
          this.toastr.info('Updated successfully','Subject Detail Register')
        },
        err=>{console.log(err);}
    );
  }

  resetForm(form: NgForm){
    form.form.reset();
    this.service.formData=new RegisterDetail();
  }

}
