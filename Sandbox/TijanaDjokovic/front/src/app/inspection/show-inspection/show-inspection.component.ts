import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/inspection-api.service';


@Component({
  selector: 'app-show-inspection',
  templateUrl: './show-inspection.component.html',
  styleUrls: ['./show-inspection.component.css']
})
export class ShowInspectionComponent implements OnInit {

  inspectionList$!:Observable<any[]>;
  inspectionTypesList$!:Observable<any[]>;
  inspectionTypesList:any=[];

  // Map to display data associated with foreign keys
  inspectionTypesMap:Map<number, string> = new Map();

  constructor(private service:InspectionApiService) { }

  ngOnInit(): void {
    this.inspectionList$=this.service.getInspectionsList();
    this.inspectionTypesList$ = this.service.getInspectionTypesList();
    this.refreshInspectionTypesMap();
  }

  //varijable koje su potrebne za stranicu ( properti )
  modalTitle:String = '';
  activateAddEditInspectionComponent:boolean = false;
  inspection:any;

  modalAdd(){
    this.inspection = {
      id:0,
      status:null,
      comments:null,
      inspectionTypeId:null
    }
    this.modalTitle = "Add Plant Inspection";
    this.activateAddEditInspectionComponent = true;
  }

  modalEdit(item:any){
    this.inspection = item;
    this.modalTitle = "Edit Plant Inspection";
    this.activateAddEditInspectionComponent = true;
  }

  delete(item:any){
    if(confirm(`Are you sure you want to delete Plant Inspection ${item.id}`)){
      this.service.deleteInspection(item.id).subscribe(res=> {
        var closeModalBtn = document.getElementById("add-edit-modal-close");
        if (closeModalBtn){
          closeModalBtn.click();
        }
        //indikacija da smo uspesno obrisali inspection
        var showDeleteSuccess = document.getElementById("delete-success-alert");
        if (showDeleteSuccess){
          showDeleteSuccess.style.display = "block";
        }
        setTimeout(function(){
          if (showDeleteSuccess){
            showDeleteSuccess.style.display = "none";
          }
        }, 4000)

        this.inspectionList$ = this.service.getInspectionsList();

        })
    }
  }

  modalClose(){
    this.activateAddEditInspectionComponent = false;
    this.inspectionList$ = this.service.getInspectionsList();
  }

  refreshInspectionTypesMap(){
    this.service.getInspectionTypesList().subscribe(data => {
      this.inspectionTypesList = data;

      for (let i = 0 ; i < data.length ; i++)
      {
        this.inspectionTypesMap.set(this.inspectionTypesList[i].id, this.inspectionTypesList[i].inspectionName);
      }
    })
  }

}
