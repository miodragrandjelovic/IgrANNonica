import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from 'src/app/services/parameters.service';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { MessageService } from '../home.service';


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
  randomize: boolean,
  inputs: string,
  output: string
}

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit {

  hpY1: Array<Number> = [];
  hpY: Array<Number> = [];
  hpX: Array<string> = [];
  inputs: any = [];
  inputsString: string;
  outputString: string = "";
  hyperparameters: string;
  hidden: boolean;
  value1: number = 10;
  value2: number = 20;
  value3: any = "";
  //dodato za default vrednosti
  lrate: number = 0.00001;
  activation: string = "sigmoid";
  regularization: string = "none";
  regularizationRate: number = 0;
  problemType: string = "regression";
  encodingType: string = "label";
  epochs: number=10;
  randomize: boolean = false;
  hpResponse: any;
  ctx: any;
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


  constructor(private http: HttpClient, private parametersService: ParametersService, private service : MessageService) {
    Chart.register(...registerables);
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title);
   } 

  get neuronControls() {
    return (<FormArray>this.hyperparametersForm.get('neurons')).controls;
   }

  ngOnInit(): void {
    this.inputs = [];
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
      'neurons': new FormArray([]),
    });

    this.parametersService.getShowHp().subscribe(res => {this.hidden = res});
    this.parametersService.getParamsObs().subscribe(res => {
      this.hyperparameters = res;
      console.log(this.hyperparameters);
    });

    this.service.messageSubject.subscribe({
      next: x => {
        if (x == 0)
        {
          this.hidden = false;
          //alert("IM HIDDEN");
        }
        else{
          this.hidden = true;
        }
      }
    })

    
  }

  onFirstTextInputChange(event:any){
    this.value1 = event.target.value;
  }

  onSecondTextInputChange(event:any){
    this.value2 = event.target.value;
  }

  showCsv() {
    this.parametersService.setShowHp(false);
  }

  onSubmitHyperparameters() {
    this.inputsString = '';
    this.outputString = '';
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

    this.inputs = this.hyperparameters.split(',');
    for (let i = 0; i < this.inputs.length - 1; i++) {
      if (i != 0)
        this.inputsString = this.inputsString.concat(',' + this.inputs[i]);
      else
        this.inputsString = this.inputsString.concat(this.inputs[i]);
    }

    this.outputString = this.outputString.concat(this.inputs[this.inputs.length - 1]);
    console.log(this.inputsString);
    console.log(this.outputString);

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
      inputs: this.inputsString,
      output: this.outputString
    } 

    this.http.post('https://localhost:7167/api/LoadData/hp', myreq).subscribe(result => {
      this.hpResponse = result;
      console.log(this.hpResponse);
      for (var i = 0; i < this.hpResponse.Loss.length; i++) {
        this.hpX.push("" + i);
        this.hpY.push(this.hpResponse.Loss[i]);
        this.hpY1.push(this.hpResponse.valLoss[i]);
      }

      console.log(this.hpY1);
      console.log(this.hpX);
      console.log(this.hpY);
      
      this.ctx = document.getElementById('chart') as HTMLCanvasElement;
      let chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.hpX,
          datasets: [{
            data: this.hpY,
            fill: false,
            label: 'Loss',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            yAxisID: 'y'
            },
            {
              data: this.hpY1,
              label: 'valLoss',
              backgroundColor: 'rgb(99, 122, 255)',
              borderColor: 'rgb(99, 122, 255)',
              yAxisID: 'y1'
            }]
          },
        options: {
          responsive: true,
          scales: {
            y: {
              display: true,
              position: 'left',
            },
            y1: {
              display: true,
              position: 'right'
            }
          }
          }
        });
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
