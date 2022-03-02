import { Component, OnInit } from '@angular/core';
import{SharedService} from 'src/app/shared.service';

@Component({
  selector: 'app-show-emp',
  templateUrl: './show-emp.component.html',
  styleUrls: ['./show-emp.component.css']
})
export class ShowEmpComponent implements OnInit {

  constructor(private service:SharedService) { }

  EmployeeList:any=[];

  ModalTitle:string="";
  ActivateAddEditEmpComp:boolean=false;
  emp:any;

  ngOnInit(): void {
    this.refreshEmpList();
  }

  refreshEmpList()
  {
    this.service.getEmpList().subscribe(data=>{
      this.EmployeeList=data;
    });
  }

  addClick()
  {
    this.emp={
      EmployeeId:0,
      EmployeeName:"",
      Department:"",
      DateOfJoining:"",
      PhotoFileName:"anonymous.png"
    }
    this.ModalTitle="Dodaj studenta";
    this.ActivateAddEditEmpComp=true;
  }

  editClick(item:any){
    this.emp=item;
    this.ModalTitle="Izmeni studenta";
    this.ActivateAddEditEmpComp=true;

  }

  
  deleteClick(item:any)
  {
    if(confirm('Da li si siguran?'))
    {
      this.service.deleteEmployee(item.EmployeeId).subscribe(data=>
        {
          alert(data.toString());
          this.refreshEmpList();
      });
    }
  }



  closeClick()
  {
    this.ActivateAddEditEmpComp=false;
    this.refreshEmpList();
  }


}
