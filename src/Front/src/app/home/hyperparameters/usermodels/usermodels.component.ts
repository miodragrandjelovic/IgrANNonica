import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usermodels',
  templateUrl: './usermodels.component.html',
  styleUrls: ['./usermodels.component.css']
})

export class UsermodelsComponent implements OnInit {

  @Output() sendResults = new EventEmitter<any>();
  //ovim saljemo nazad ka hyperparamteres komponenti model

  constructor(private http: HttpClient,private modalService: NgbModal){}
  modelsNames: any;
  selectedModels:any;

  ngOnInit(): void {
    this.getModels();
  }

  getModels()
  {
    this.http.get<any>('https://localhost:7167/api/Python/savedModels').subscribe(result => {  //uzima nazive svih datasetova od ulogovanog korisnika
            console.log(result);
            this.modelsNames=result;
            console.log(this.modelsNames);
        });

        this.selectedModels = '';
  }

  selectModels(event:any){
    this.selectedModels=event.target.value;
    console.log('ovo je kliknuto za naziv '+this.selectedModels);
    //alert(this.selectedModels);
    this.loadThisModel('ime_models');
  }

  loadThisModel(naziv:any){
    return this.http.post<any>('https://localhost:7167/api/LoadData/selectedModel?name='+naziv, {
        name: naziv
      }).subscribe(selectedModelUser=>{
        
        console.log(selectedModelUser);
        //alert("SALJEMO RES");

        this.sendResults.emit(selectedModelUser);
        // sada ovo saljemo nazad da se podese hiperparametri


        /*
        var map = new Map<string, string[]>();
    
        for(var i = 0; i < result.length; i++) {
          if(i == 0) {
            var aaa = Object.keys(result[i]);
            for(var j = 0; j < aaa.length; j++) {
              map.set(aaa[j], ["" + Object.values(result[i])[j]]);
            }
          } else {
            var aaa = Object.keys(result[i]);
            for(var j = 0; j < aaa.length; j++) {
              var array = map.get(aaa[j]);
              if(array == undefined) array = [];
              array.push("" + Object.values(result[i])[j]);
              map.set(aaa[j], array);
            }
          }
        }
        console.log(map);
        this.map=map;
        this.array2d=Array.from(map.values());
    
        this.array2d= this.array2d[0].map((_, colIndex) =>this.array2d.map(row => row[colIndex]));
      
        */
      });
    }
    
  closeResult: string | undefined;
  addNewData(newData: any){
     //alert(contentLogin);
     //this.showMe = false;
     this.modalService.open(newData, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
