import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { CheckboxControlValueAccessor, Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from 'src/app/services/parameters.service';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { MessageService } from '../home.service';
import { GraphicComponent } from '../../graphic/graphic.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/loading/loading.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';

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

interface CheckBox {
  id: Number;
  label: string;
  values: Array<Number>;
  valuesVal: Array<Number>;
  isChecked: Boolean;
}

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit {


  @ViewChild(GraphicComponent) graphic: GraphicComponent;

  inputCheckBoxes : Array<CheckBox> = [];
  selectedCheckBoxes: Array<CheckBox> = [];
  properties: Array<string> = [];
  hpY1: Array<Number> = [];
  hpY: Array<Number> = [];
  hpX: Array<string> = [];
  inputs: any = [];
  inputsString: string;
  outputString: string = "";
  hyperparameters: string;
  hidden: boolean;
  value1: number = 80;
  value2: number = 10;
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

  session:any;
  prikazGrafika=false;

  options1: Options = {
    floor: 0,
    ceil: 100,
    step: 5
  };
  options2: Options = {
    floor: 0,
    ceil: 50,
    step: 5
  };

  hyperparametersForm!: FormGroup;


  constructor(private http: HttpClient, public spiner:LoadingService, private parametersService: ParametersService, private service : MessageService, private modalService: NgbModal) {
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


    //this.parametersService.getShowHp().subscribe(res => {this.hidden = res});
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
    });

    this.onAddLayer();

    this.session=sessionStorage.getItem('username');
  }

  fetchSelectedGraphics() {
    this.selectedCheckBoxes = this.inputCheckBoxes.filter((value, index) => {
      return value.isChecked;
    })
  }

  changeSelection() {
    this.fetchSelectedGraphics();
    console.log(this.selectedCheckBoxes);
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
    console.log(myreq);

    this.http.post('https://localhost:7167/api/LoadData/hp', myreq).subscribe(result => {
      this.hpResponse = result;
      console.log(this.hpResponse);
      this.properties = Object.keys(this.hpResponse);
      for (let i = 0; i < this.properties.length; i++) {
        if (this.properties[i] == 'label' || this.properties[i] == 'eveluate')
          continue;
        if (this.properties[i] == 'pred')
          break;
        const str = 'val' + this.properties[i];
        let object: CheckBox = {
          id: i + 1,
          label: this.properties[i],
          values: this.hpResponse[this.properties[i]],
          valuesVal: this.hpResponse[str],  
          isChecked: true
        }
        console.log(object);
        this.inputCheckBoxes.push(object);
      }

      this.fetchSelectedGraphics();
      console.log(this.selectedCheckBoxes);
      });
      
      this.prikazGrafika=true;
      this.spiner.showSpiner=true;
    }

  countLayers=0;
  onAddLayer() {
    this.countLayers++;
    const control = new FormControl(0);
    (<FormArray>this.hyperparametersForm.get('neurons')).push(control);
  }

  onRemoveLayer() {
    this.countLayers--;
    (<FormArray>this.hyperparametersForm.get('neurons')).removeAt(this.countLayers);
  }

  onAddNeuron(){
    
  }
  onRemoveNeuron(i:number){
    
    
  }

    currentVal=0;
    getVal(val:any){
    console.warn(val)
    this.currentVal=val;
  }

   closeResult: string | undefined;
   addNewModel(newModel: any){
      //alert(contentLogin);
      //this.showMe = false;
      this.modalService.open(newModel, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
