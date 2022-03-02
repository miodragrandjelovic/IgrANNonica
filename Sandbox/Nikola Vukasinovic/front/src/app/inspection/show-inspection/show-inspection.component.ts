import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/inspection-api.service';

@Component({
  selector: 'app-show-inspection',
  templateUrl: './show-inspection.component.html',
  styleUrls: ['./show-inspection.component.css']
})
export class ShowInspectionComponent implements OnInit {

  PredmetList$!:Observable<any[]>;
  ImePredmetasList$!:Observable<any[]>;
  ImePredmetasList:any=[];
  
  ImePredmetasMap:Map<number, string> = new Map()

  constructor(private service:InspectionApiService) { }

  ngOnInit(): void {
    this.PredmetList$ = this.service.getPredmetList();
    this.ImePredmetasList$ = this.service.getImePredmetasList();
    this.refreshImePredmetasMap();
  }


  // Variables
  modalTitle:string = '';
  activateAddEditPredmetComponent:boolean = false;
  predmet:any;


  modalAdd(){
    this.predmet = {
      id:0,
      status:null,
      komentar:null,
      imePredmetaId:null
    }
    this.modalTitle = "Dodaj predmet";
    this.activateAddEditPredmetComponent = true;

  }

  modalEdit(item:any){
    this.predmet = item;
    this.modalTitle = "Izmeni Predmet";
    this.activateAddEditPredmetComponent = true;
  }

  delete(item:any){
    if(confirm(`Da li ste sigurni da hocete da obrisete ${item.id}`)){
      this.service.deletePredmet(item.id).subscribe(res => {
        var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn){
        closeModalBtn.click();
      }

      var showDeleteSuccess = document.getElementById('delete-success-alert');
      if(showDeleteSuccess){
        showDeleteSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showDeleteSuccess) {
          showDeleteSuccess.style.display = "none"
        }
      }, 4000);
      this.PredmetList$ = this.service.getPredmetList();
      })
    }
  }

  modalClose(){
    this.activateAddEditPredmetComponent = false;
    this.PredmetList$ = this.service.getPredmetList();
  }


  refreshImePredmetasMap(){
    this.service.getImePredmetasList().subscribe(data => {
      this.ImePredmetasList = data;
      
      for(let i = 0; i < data.length; i++)
      {
        this.ImePredmetasMap.set(this.ImePredmetasList[i].id, this.ImePredmetasList[i].iPredmet);

      }
    })
  }

}
