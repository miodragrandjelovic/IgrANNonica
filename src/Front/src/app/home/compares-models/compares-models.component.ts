import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../home.service';

interface Models {
  name: String,
  date: Date,
  fromCsv:String
}

interface Buut{
  name:String,
  ukljucen:Boolean
} 

@Component({
  selector: 'app-compares-models',
  templateUrl: './compares-models.component.html',
  styleUrls: ['./compares-models.component.css']
})
export class ComparesModelsComponent implements OnInit {

  hidden:boolean=true;
  constructor(private service : MessageService,private http: HttpClient) {  }
  
  Modelss:Models[]=[];
  chooseModels:String[]=[];
  changeButt:Buut[]=[];
  butt:Buut;
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

    this.getModels();
  }

  getModels()
  {
    console.log("idemo");
    this.http.get<any>('https://localhost:7167/api/Python/savedModels').subscribe(result => {  
          console.log(result);
          this.Modelss=result;
          
          for(var i of this.Modelss)
          {
            this.butt={name:i.name,ukljucen:true};
            this.changeButt.push(this.butt);
          }
          console.log(this.changeButt);
        }); 
  }

  Izaberi(model1:String)
  {
    
    if(this.chooseModels.length<2)
    {
      this.chooseModels.push(model1);

      for(var i of this.changeButt)
      {
        if(i.name==model1)
          i.ukljucen=false;
      }
        console.log(this.changeButt);
      console.log(this.chooseModels);
    }
    else
    {
      alert("Vec si izabrao 2 argumenta");
    }
  
  }
  Izbaci(model1:String)
  {
     this.chooseModels.forEach((element,index)=>{
       if(element==model1) this.chooseModels.splice(index,1);
     });
     for(var i of this.changeButt)
      {
        if(i.name==model1)
          i.ukljucen=true;
      }
    console.log(this.chooseModels);
  }
  
  daliJeUkljucen(model1:String):Boolean
  {
    for(var i of this.changeButt)
    {
      if(i.name==model1)
        return i.ukljucen;
    }
    return true;
  }

}
