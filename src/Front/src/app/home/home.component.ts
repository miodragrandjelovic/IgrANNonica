import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  value1: number = 70;
  value2: number = 70;
  options1: Options = {
    floor: 0,
    ceil: 100
  };
  options2: Options = {
    floor: 0,
    ceil: 100
  };

  hyperparametersForm!: FormGroup;


  constructor() { }

  get neuronControls() {
   return (<FormArray>this.hyperparametersForm.get('neurons')).controls;
  }

  ngOnInit(): void {
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
  }

  onSubmitHyperparameters() {
    console.log(this.hyperparametersForm)
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
 
