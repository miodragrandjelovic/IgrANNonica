import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegisterDetail } from '../shared/register-detail.model';
import { RegisterDetailService } from '../shared/register-detail.service';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styles: [
  ]
})
export class RegisterDetailsComponent implements OnInit {

  constructor(public service: RegisterDetailService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }

  populateForm(selectedRecord:RegisterDetail){
    this.service.formData=Object.assign({}, selectedRecord);
  }

  onDelete(id:number){
    if(confirm('Are you sure to delete this record?'))
    {
      this.service.deleteRegisterDetail(id)
      .subscribe(
        res=>{
          this.service.refreshList();
          this.toastr.error("Deleted successfully", 'Subject Detail Register')
        },
        err=>{console.log(err)}
      )
    }
  }

}
