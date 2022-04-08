import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from '../services/parameters.service';
import { MessageService } from './home.service';


interface RequestHyperparameters{
  encodingType: string,
  learningRate: number,
  activation: string,
  epoch: number,
  regularization: string,
  regularizationRate: number,
  problemType: string,
  layers: number,
  neuronsLvl1: number,
  neuronsLvl2: number,
  neuronsLvl3: number,
  neuronsLvl4: number,
  neuronsLvl5: number,
  ratio: number,
  batchSize: number,
  randomize: boolean
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MessageService],
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    
  edited: boolean = false;
  value1: number = 10;
  value2: number = 20;
  //dodato za default vrednosti
  lrate: number = 0.00001;
  activation: string = "sigmoid";
  regularization: string = "none";
  regularizationRate: number = 0;
  problemType: string = "regression";
  encodingType: string = "label";
  epochs: number=10;
  randomize: boolean = false; 
  //layers:Array<string> = ["5","5","5","5","5"]
  //

  options1: Options = {
    floor: 0,
    ceil: 100,
    //step: 10
  };
  options2: Options = {
    floor: 0,
    ceil: 50
  };

  hyperparametersForm!: FormGroup;


  constructor(private http: HttpClient, private service: MessageService) { }

  get neuronControls() {
   return (<FormArray>this.hyperparametersForm.get('neurons')).controls;
  }

  ngOnInit(): void {
    this.service.sayMessage(0);

    this.hyperparametersForm = new FormGroup({
      'encodingType': new FormControl(null),
      'learningRate': new FormControl(0),
      'activation': new FormControl(null),
      'epoch': new FormControl(0),
      'regularization': new FormControl(null),
      'regularizationRate': new FormControl(0),
      'problemType': new FormControl(null),
      'ratio': new FormControl(0),
      'batchSize': new FormControl(0),
      'randomize': new FormControl(0),
      'neurons': new FormArray([])
    });

  }

  // salje se komponenta child-u <app-csv> poruka je 0
  showCsvData(){
    this.service.sayMessage(0);
  }

  // salje se komponenta childu <app-hyperparameters> - poruka je 1
  showHyperp(){
    this.service.sayMessage(1);
  }


  showCsv() {
    this.edited = true;
  }
  showHp() {
    this.edited = false;
  }

  onSubmitHyperparameters() {
    console.log(this.hyperparametersForm)
    const layers = (<FormArray>this.hyperparametersForm.get('neurons')).controls.length;
    const neurons = (<FormArray>this.hyperparametersForm.get('neurons')).controls;
    let neuron1 = 0, neuron2 = 0, neuron3 = 0, neuron4 = 0, neuron5 = 0;
    for (let i = 0; i < layers; i++)  {
      if (i == 0)
        neuron1 = neurons[i].value;
      else if (i == 1)
        neuron2 = neurons[i].value;
      else if (i == 2)
        neuron3 = neurons[i].value;
      else if (i == 3)
        neuron4 = neurons[i].value;
      else
        neuron5 = neurons[i].value;
    }

    const myreq: RequestHyperparameters = {
      encodingType : this.hyperparametersForm.get('encodingType')?.value,
      learningRate : Number(this.hyperparametersForm.get('learningRate')?.value),
      activation : this.hyperparametersForm.get('activation')?.value,
      epoch: this.hyperparametersForm.get('epoch')?.value,
      regularization: this.hyperparametersForm.get('regularization')?.value,
      regularizationRate: Number(this.hyperparametersForm.get('regularizationRate')?.value),
      problemType: this.hyperparametersForm.get('problemType')?.value,
      layers: layers,
      neuronsLvl1: Number(neuron1),
      neuronsLvl2: Number(neuron2),
      neuronsLvl3: Number(neuron3),
      neuronsLvl4: Number(neuron4),
      neuronsLvl5: Number(neuron5),
      ratio: this.hyperparametersForm.get('ratio')?.value,
      batchSize: this.hyperparametersForm.get('batchSize')?.value,
      randomize: this.hyperparametersForm.get('randomize')?.value,
    }

    console.log(myreq);

    this.http.post('https://localhost:7167/api/LoadData/hp', myreq).subscribe(result => {
      console.log(result);
    });

  }


  onAddLayer() {
    const control = new FormControl(0);
    (<FormArray>this.hyperparametersForm.get('neurons')).push(control);
  }

  onRemoveLayer(i:number) {
    (<FormArray>this.hyperparametersForm.get('neurons')).removeAt(i);
  }

    currentVal=0;
    getVal(val:any){
    console.warn(val)
    this.currentVal=val;
  }

}