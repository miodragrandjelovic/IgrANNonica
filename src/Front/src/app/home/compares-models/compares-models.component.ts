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

  graphic1:Object={'AUC':[ 0.5664850473403931, 0.7239888906478882, 0.7419571876525879, 0.7609072923660278, 0.7678300738334656 ],
  'Accuracy':[ 0.04278074949979782, 0.04278074949979782, 0.08556149899959564, 0.26737967133522034, 0.26737967133522034, 0.26737967133522034, 0.26737967133522034 ],
  'Loss':[1.928948998451233, 1.830127239227295, 1.7689709663391113, 1.740342378616333, 1.7211871147155762, 1.707237720489502, 1.696409821510315],
  'Precision':[ 0, 0, 0, 0, 0, 0, 0],
  'Recall':[ 0, 0, 0, 0, 0, 0, 0],
  'eveluate':{'accuracy':0.25,
              'auc':0.6543456456,
              'loss':1.8264234,
              'precision':0,
              'recall':0
              },
  'label':[1, 3, 1, 6, 5, 3, 6, 6, 5, 6,4,1,6,4,1,5,1,2,0,0,2,1,6,5],
  'pred':[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  'valAUC':[ 0.6285444498062134, 0.6219282150268555, 0.6227158308029175, 0.6523314714431763, 0.6578450202941895, 0.6740705966949463, 0.6836799383163452],
  'valAccuracy':[ 0.043478261679410934, 0.043478261679410934, 0.043478261679410934, 0.260869562625885, 0.260869562625885, 0.260869562625885, 0.260869562625885],
  'valLoss':[1.913610816001892, 1.852399468421936, 1.816717505455017, 1.7902040481567383, 1.7712554931640625, 1.7432063817977905, 1.7193152904510498],
  'valPrecision':[0, 0, 0, 0, 0, 0, 0],
  'valRecall':[0, 0, 0, 0, 0, 0, 0]};
  
  graphic2:Object={'AUC':[ 0.5664850473403931, 0.7239888906478882, 0.7419571876525879, 0.7609072923660278, 0.7678300738334656 ],
  'Accuracy':[ 0.04278074949979782, 0.04278074949979782, 0.08556149899959564, 0.26737967133522034, 0.26737967133522034, 0.26737967133522034, 0.26737967133522034 ],
  'Loss':[1.928948998451233, 1.830127239227295, 1.7689709663391113, 1.740342378616333, 1.7211871147155762, 1.707237720489502, 1.696409821510315],
  'Precision':[ 0, 0, 0, 0, 0, 0, 0],
  'Recall':[ 0, 0, 0, 0, 0, 0, 0],
  'eveluate':{'accuracy':0.25,
              'auc':0.6543456456,
              'loss':1.8264234,
              'precision':0,
              'recall':0
              },
  'label':[1, 3, 1, 6, 5, 3, 6, 6, 5, 6,4,1,6,4,1,5,1,2,0,0,2,1,6,5],
  'pred':[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  'valAUC':[ 0.6285444498062134, 0.6219282150268555, 0.6227158308029175, 0.6523314714431763, 0.6578450202941895, 0.6740705966949463, 0.6836799383163452],
  'valAccuracy':[ 0.043478261679410934, 0.043478261679410934, 0.043478261679410934, 0.260869562625885, 0.260869562625885, 0.260869562625885, 0.260869562625885],
  'valLoss':[1.913610816001892, 1.852399468421936, 1.816717505455017, 1.7902040481567383, 1.7712554931640625, 1.7432063817977905, 1.7193152904510498],
  'valPrecision':[0, 0, 0, 0, 0, 0, 0],
  'valRecall':[0, 0, 0, 0, 0, 0, 0]};


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

  drawGraphic1()
  {
    this.inputCheckBoxes1 = [];
    this.hpResponse1 = this.graphic1;
    console.log("idemo1");
    console.log(this.hpResponse1);
    this.properties1 = Object.keys(this.hpResponse1);

    for (let i = 0; i < this.properties1.length; i++) {
      if (this.properties1[i] == 'label') {
          this.label1 = this.hpResponse1[this.properties1[i]];
          continue;
      }
      if (this.properties1[i] == 'pred') {
        this.pred1 = this.hpResponse1[this.properties1[i]];
        break;
      }
      if (this.properties1[i] == 'eveluate') {
        this.eveluate1 = this.hpResponse1[this.properties1[i]];
        console.log(this.eveluate1);
        continue;
      }
      const str = 'val' + this.properties1[i];
      let object: CheckBox = {
        id: i + 1,
        label: this.properties1[i],
        values: this.hpResponse1[this.properties1[i]],
        valuesVal: this.hpResponse1[str],  
        isChecked: true
      }
      this.inputCheckBoxes1.push(object);
    }
    console.log("idemo1");
    console.log(this.inputCheckBoxes1);
    this.prikazGrafika1=true;
  }
  
  drawGraphic2()
  {
    this.inputCheckBoxes2 = [];
    this.hpResponse2 = this.graphic2;
    console.log("idemo2");
    console.log(this.hpResponse2);
    this.properties2 = Object.keys(this.hpResponse2);

    for (let i2 = 0; i2 < this.properties2.length; i2++) {
      if (this.properties2[i2] == 'label') {
          this.label2 = this.hpResponse2[this.properties2[i2]];
          console.log(this.label2);
          continue;
      }
      if (this.properties2[i2] == 'pred') {
        this.pred2 = this.hpResponse2[this.properties2[i2]];
        break;
      }
      if (this.properties2[i2] == 'eveluate') {
        this.eveluate2 = this.hpResponse2[this.properties2[i2]];
        console.log(this.eveluate2);
        continue;
      }
      const str = 'val' + this.properties2[i2];
      let object: CheckBox = {
        id: i2 + 1,
        label: this.properties2[i2],
        values: this.hpResponse2[this.properties2[i2]],
        valuesVal: this.hpResponse2[str],  
        isChecked: true
      }
      this.inputCheckBoxes2.push(object);
    }
    console.log("idemo2");
    console.log(this.inputCheckBoxes2);
    this.prikazGrafika2=true;
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
        this.table=true;    
        this.drawGraphic1();
        this.drawGraphic2();
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
