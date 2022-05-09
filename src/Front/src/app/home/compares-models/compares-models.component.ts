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
interface ModelsForC{
  dirname1:String;
  modelname1:String
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
  copyModels:Models[]=[];
  modelsFilteredNames:Models[]=[];
  searchInputField: any ;

  chooseModels:ModelsForC[]=[];
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
          this.copyModels=result;
          for(var i of this.Modelss)
          {
            this.butt={name:i.name,ukljucen:true};
            this.changeButt.push(this.butt);
          }
          console.log(this.changeButt);
        }); 
  }

  Izaberi(model1:Models)
  {
    
    if(this.chooseModels.length<2)
    {
      this.chooseModels.push({dirname1:model1.fromCsv,modelname1:model1.name});

      for(var i of this.changeButt)
      {
        if(i.name==model1.name)
          i.ukljucen=false;
      }
      console.log(this.chooseModels);
    }
    else
    {
      alert("Vec si izabrao 2 argumenta");
    }
  
  }
  Izbaci(model1:Models)
  {
     this.chooseModels.forEach((element,index)=>{
       if(element.modelname1==model1.name) this.chooseModels.splice(index,1);
     });
     for(var i of this.changeButt)
      {
        if(i.name==model1.name)
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

  CompareModels1()
  {
    if(this.chooseModels.length!=2)
    {
      alert("Nisi izabrao 2 modela");
    }
    else
    {
        this.http.post<any>('https://localhost:7167/api/LoadData/modelForCompare?dirname='+this.chooseModels[0].dirname1+";modelname="+this.chooseModels[0].modelname1,{
          dirname:this.chooseModels[0].dirname1,
          modelname:this.chooseModels[0].modelname1
        }).subscribe(result1 => {  
          console.log(result1);
          
        }); 
      
        this.http.post<any>('https://localhost:7167/api/LoadData/modelForCompare?dirname='+this.chooseModels[1].dirname1+";modelname="+this.chooseModels[1].modelname1,{
          dirname:this.chooseModels[1].dirname1,
          modelname:this.chooseModels[1].modelname1
        }).subscribe(result2 => {  
          console.log(result2);
          
        }); 
         
    }
  }
  searchDatasets()
  {
    this.modelsFilteredNames = [];
    this.Modelss = this.copyModels;
    if( this.searchInputField != ""){
    for (var index = 0; index < this.Modelss.length; index++) {
      if(this.Modelss[index].name.indexOf(this.searchInputField.toLowerCase()) !== -1){
        this.modelsFilteredNames.push(this.Modelss[index]);
      }  
    }

    this.Modelss = this.modelsFilteredNames;
   }
  }

}
