import { Component, Input ,OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/inspection-api.service';
@Component({
  selector: 'app-add-edit-inspection',
  templateUrl: './add-edit-inspection.component.html',
  styleUrls: ['./add-edit-inspection.component.css']
})
export class AddEditInspectionComponent implements OnInit {

  PredmetList$!: Observable<any[]>;
  statusList$!:Observable<any[]>;
  ImePredmetasList$!:Observable<any[]>;

  constructor(private service:InspectionApiService) { }

  @Input() predmet:any;
  id:number = 0;
  status:string ="";
  komentar:string="";
  imePredmetaId!:number;

  ngOnInit(): void {
    this.id = this.predmet.id;
    this.status = this.predmet.status;
    this.komentar = this.predmet.komentar;
    this.imePredmetaId = this.predmet.imePredmetaId;
    this.statusList$ = this.service.getStatusList();
    this.PredmetList$ = this.service.getPredmetList();
    this.ImePredmetasList$ = this.service.getImePredmetasList();
  }

  addPredmet(){
    var predmet = {
      status:this.status,
      komentar:this.komentar,
      imePredmetaId:this.imePredmetaId,
    }
    this.service.addPredmet(predmet).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn){
        closeModalBtn.click();
      }

      var showAddSuccess = document.getElementById('add-success-alert');
      if(showAddSuccess){
        showAddSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showAddSuccess) {
          showAddSuccess.style.display = "none"
        }
      }, 4000);
    })
  }

  updatePredmet(){
    var predmet = {
      id: this.id,
      status:this.status,
      komentar:this.komentar,
      imePredmetaId:this.imePredmetaId,
    }
    var id:number = this.id;
    this.service.updatePredmet(id, predmet).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn){
        closeModalBtn.click();
      }

      var showUpdateSuccess = document.getElementById('update-success-alert');
      if(showUpdateSuccess){
        showUpdateSuccess.style.display = "block";
      }
      setTimeout(function() {
        if(showUpdateSuccess) {
          showUpdateSuccess.style.display = "none"
        }
      }, 4000);
    })
  }
}
