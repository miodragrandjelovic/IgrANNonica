import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../home.service';

@Component({
  selector: 'app-compares-models',
  templateUrl: './compares-models.component.html',
  styleUrls: ['./compares-models.component.css']
})
export class ComparesModelsComponent implements OnInit {

  hidden:boolean=true;
  constructor(private service : MessageService,private http: HttpClient) {  this.getModels() }

  models:string[];

  ngOnInit(): void {
    
    this.service.messageSubject.subscribe({
      next: x => {
        if (x==2)
        {
          this.hidden = false;
          
        }
        else{
          this.hidden = true;
        }
      }
    });
  }

  getModels()
  {
    this.http.get<any>('https://localhost:7167/api/Python/savedModels').subscribe(result => {  
          console.log(result);
          this.models=result;
         /* this.models.push("model1");
          this.models.push("model2");
          this.models.push("model3");
          this.models.push("model4");*/
        }); 
  }


}
