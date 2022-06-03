import { HttpClient } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';
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

interface CheckBox {
  id: Number;
  label: string;
  values: Array<Number>;
  valuesVal: Array<Number>;
  isChecked: Boolean;
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

  inputCheckBoxes1 : Array<CheckBox> = [];
  hpResponse1:any;
  properties1: Array<string> = [];
  eveluate1: any;
  label1: any;
  pred1: any;
  prikazGrafika1:boolean=false;
  
  inputCheckBoxes2 : Array<CheckBox> = [];
  hpResponse2:any;
  properties2: Array<string> = [];
  eveluate2: any;
  label2: any;
  pred2: any;
  prikazGrafika2:boolean=false;

  table:boolean=false;
  checkboxArray1: Array<CheckBox> = [];
  checkboxArray2: Array<CheckBox> = [];
  str : string;

  

  ngOnInit(): void {
    
    this.service.messageSubject.subscribe({
      next: x => {
        if (x==2)
        {
          this.hidden = false;
          this.getModels();
          
        }
        else{
          this.hidden = true;
        }
      }
    });
  }


  getModels()
  {
    let user = sessionStorage.getItem('username')
    this.http.get<any>('https://localhost:7167/api/Python/savedModels?Username=' + user).subscribe(result => {  
          this.Modelss=result;
          this.copyModels=result;
          for(var i of this.Modelss)
          {
            this.butt={name:i.name,ukljucen:true};
            this.changeButt.push(this.butt);
          }
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
        let user = sessionStorage.getItem('username');
        this.checkboxArray1 = [];
        this.http.post<any>('https://localhost:7167/api/LoadData/modelForCompare?dirname='+this.chooseModels[0].dirname1+"&modelname="+this.chooseModels[0].modelname1 + "&Username=" + user,{
          dirname:this.chooseModels[0].dirname1,
          modelname:this.chooseModels[0].modelname1
        }).subscribe(result1 => {  
          this.hpResponse1 = result1;
          this.properties1 = Object.keys(this.hpResponse1);
          for (let i = 0; i < this.properties1.length; i++) {
            if (this.properties1[i].includes('val')) {
              continue;
            }
            if (this.properties1[i] == 'label') {
              this.label1 = this.hpResponse1[this.properties1[i]];
              continue;
          }
            if (this.properties1[i] == 'pred') {
              this.pred1 = this.hpResponse1[this.properties1[i]];
              continue;
            }
            if (this.properties1[i] == 'evaluate') {
              this.eveluate1 = this.hpResponse1[this.properties1[i]];
              continue;
            }

            if (this.properties1[i] == 'loss') {
              this.properties1[i] = 'Loss';
            }

            if (this.properties1[i] == 'accuracy')
              this.str = 'val' + 'Accuracy';
            else if (this.properties1[i] == 'f1_score')
              this.str = 'val' + 'F1_score';
            else if (this.properties1[i] == 'precision')
              this.str = 'val' + 'Precision';
            else if (this.properties1[i] == 'recall')
              this.str = 'val' + 'Recall'
            else
              this.str = `val${this.properties1[i].includes('Loss') ? this.properties1[i] : this.properties1[i].toUpperCase()}`;
            let object: CheckBox = {
              id: i + 1,
              label: this.properties1[i],
              values: this.hpResponse1[this.properties1[i].toLowerCase()],
              valuesVal: this.hpResponse1[this.str],  
              isChecked: true
            }
            console.log(this.properties1[i]);
            console.log(this.str);
            this.checkboxArray1.push(object);
              }
        }); 
      
        this.http.post<any>('https://localhost:7167/api/LoadData/modelForCompare?dirname='+this.chooseModels[1].dirname1+"&modelname="+this.chooseModels[1].modelname1 + "&Username=" + user,{
          dirname:this.chooseModels[1].dirname1,
          modelname:this.chooseModels[1].modelname1
        }).subscribe(result2 => {
          this.checkboxArray2 = [];
          this.hpResponse2 = result2;
          this.properties2 = Object.keys(this.hpResponse2);
          for (let i = 0; i < this.properties2.length; i++) {
            if (this.properties2[i].includes('val')) {
              continue;
            }
            if (this.properties2[i] == 'label') {
              this.label2 = this.hpResponse2[this.properties2[i]];
              continue;
          }
            if (this.properties2[i] == 'pred') {
              this.pred2 = this.hpResponse2[this.properties2[i]];
              continue;
            }
            if (this.properties2[i] == 'evaluate') {
              this.eveluate2 = this.hpResponse2[this.properties2[i]];
              continue;
            }

            if (this.properties2[i] == 'loss') {
              this.properties2[i] = 'Loss';
            }

            if (this.properties2[i] == 'accuracy')
              this.str = 'val' + 'Accuracy';
            else if (this.properties2[i] == 'f1_score')
              this.str = 'val' + 'F1_score';
            else if (this.properties2[i] == 'precision')
              this.str = 'val' + 'Precision';
            else if (this.properties2[i] == 'recall')
              this.str = 'val' + 'Recall'
            else
              this.str = `val${this.properties2[i].includes('Loss') ? this.properties2[i] : this.properties2[i].toUpperCase()}`;
            let object: CheckBox = {
              id: i + 1,
              label: this.properties2[i],
              values: this.hpResponse2[this.properties2[i].toLowerCase()],
              valuesVal: this.hpResponse2[this.str],  
              isChecked: true
            }
            this.checkboxArray2.push(object);
              }
            console.log(this.checkboxArray1);
            console.log(this.checkboxArray2);
            this.table=true;
        }); 
  
        //this.drawGraphic1();
        //this.drawGraphic2();
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
