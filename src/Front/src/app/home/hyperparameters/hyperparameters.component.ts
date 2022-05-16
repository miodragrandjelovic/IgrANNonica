import { Component, OnInit, ViewChild } from '@angular/core';
import { Options, CustomStepDefinition, LabelType } from '@angular-slider/ngx-slider';
import { CheckboxControlValueAccessor, Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ParametersService } from 'src/app/services/parameters.service';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { MessageService } from '../home.service';
import { GraphicComponent } from '../../graphic/graphic.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/loading/loading.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as myUrls from 'src/app/urls';
interface RequestHyperparameters {
  learningRate: number,
  epoch: number,
  regularization: string,
  regularizationRate: number,
  problemType: string,
  layers: number,
  ratio: number,
  batchSize: number,
  valAndTest:number,
  randomize: boolean,
  inputs: string,
  output: string,
  activationFunctions:Array<any>,
  numberOfNeurons:Array<any>,
  encodings: Array<any>,
  catNum: Array<any>,
  missingValues: Array<any>,
  columNames: Array<any>
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
  value2: number = 16;
  value3: number = 50;
  //dodato za default vrednosti
  lrate: number = 0.00001;
  activation: string = "sigmoid";
  regularization: string = "none";
  regularizationRate: number = 0;
  problemType: string = "regression";
  encodingType: string = "label";
  epochs: any=10;
  randomize: boolean = false;
  hpResponse: any;
  ctx: any;
  showGraphic: boolean;
  catNum: Array<string> = [];
  encodings: Array<string> = [];
  columNames: Array<string> = [];
  missingValues: Array<string> = [];
  eveluate: any;
  label: any;
  pred: any;
  //layers:Array<string> = ["5","5","5","5","5"]
  //
  activationFunctions:Array<any>=[];

  session:any;
  prikazGrafika=false;
  show: boolean = false;

  options1: Options = {
    floor: 0,
    ceil: 100,
    step: 5
  };
  
  steps = [{value: 2}, {value:4}, {value:8}, {value:16}, {value:32}, {value:64}];

  options2: Options = {
    stepsArray: this.steps.map((s): CustomStepDefinition => {
      return { value: s.value };
    })
  };

  options3: Options = {
    floor: 0,
    ceil: 100,
    step: 5
  };

  hyperparametersForm!: FormGroup;


  constructor(private http: HttpClient, public spiner:LoadingService, private parametersService: ParametersService, private service : MessageService, private modalService: NgbModal) {
    Chart.register(...registerables);
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title);
   } 
  public url = myUrls.url;
  get neuronControls() {
    return (<FormArray>this.hyperparametersForm.get('neurons')).controls;
   }

   listaNeurona(i:number) {
    return (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value;
   }

  ngOnInit(): void {
    this.spiner.getShowSpinner().subscribe(newValue => {
      this.show = newValue;
    });
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
      'valAndTest' : new FormControl(0),
      'randomize': new FormControl(0),
      'neurons': new FormArray([]),
      'modelName':new FormControl(null),
    });

    //this.parametersService.getShowHp().subscribe(res => {this.hidden = res});
    this.parametersService.getParamsObs().subscribe(res => {
      this.hyperparameters = res;
    });

    this.service.messageSubject.subscribe({
      next: x => {
        if (x == 0 || x==3)
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

    this.parametersService.getCatNum().subscribe(res => {
      this.catNum = res;
    });
    this.parametersService.getEncodings().subscribe(res => {
      this.encodings = res;
    });
    this.parametersService.getColumNames().subscribe(res => {
      this.columNames = res;
    });
    this.parametersService.getMissingValues().subscribe(res => {
      this.missingValues = res;
    });
  }

  fetchSelectedGraphics() {
    this.selectedCheckBoxes = this.inputCheckBoxes.filter((value, index) => {
      return value.isChecked;
    })

    var ldRes = document.getElementById("trainingResults");
    if (ldRes) {
      //alert("Prikaz");
      //ldRes.style.backgroundColor = 'red';
      ldRes.scrollIntoView({ behavior: 'smooth' });
    }
  }

  changeSelection() {
    this.fetchSelectedGraphics();
  }

  onFirstTextInputChange(event:any){
    this.value1 = event.target.value;
  }

  onSecondTextInputChange(event:any){
    this.value2 = event.target.value;
  }
  onThirdTextInputChange(event:any){
    this.value3 = event.target.value;
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

    this.countAllNeurons();

  this.parametersService.getCatNum().subscribe(res => {
    this.catNum = res;
  });
  this.parametersService.getEncodings().subscribe(res => {
    this.encodings = res;
  });
  this.parametersService.getColumNames().subscribe(res => {
    this.columNames = res;
  });

  this.parametersService.getMissingValues().subscribe(res => {
    this.missingValues = res;
  });

    const myreq: RequestHyperparameters = {
      learningRate : Number(this.hyperparametersForm.get('learningRate')?.value),
      epoch: this.hyperparametersForm.get('epoch')?.value,
      regularization: this.hyperparametersForm.get('regularization')?.value,
      regularizationRate: Number(this.hyperparametersForm.get('regularizationRate')?.value),
      problemType: this.hyperparametersForm.get('problemType')?.value,
      layers: this.countLayers,
      ratio: this.hyperparametersForm.get('ratio')?.value,
      batchSize: this.hyperparametersForm.get('batchSize')?.value,
      randomize: this.hyperparametersForm.get('randomize')?.value,
      valAndTest: this.hyperparametersForm.get('valAndTest')?.value,
      inputs: this.inputsString,
      output: this.outputString,
      activationFunctions:this.activacioneFunkc,
      numberOfNeurons:this.neuronsLength,
      catNum: this.catNum,
      encodings: this.encodings,
      missingValues: this.missingValues,
      columNames: this.columNames
    } 

    this.http.post(this.url + '/api/LoadData/hpNeprijavljen', myreq).subscribe(result => {
    
      console.log("Rezultat slanja HP treninga je "  + result);
      
      this.scrollToResults("prikazRezutata");

      this.inputCheckBoxes = [];
      this.selectedCheckBoxes = [];
      this.properties = [];
      this.hpResponse = result;
      this.properties = Object.keys(this.hpResponse);
      for (let i = 0; i < this.properties.length; i++) {
        if (this.properties[i] == 'label') {
            this.label = this.hpResponse[this.properties[i]];
            continue;
        }
        if (this.properties[i] == 'pred') {
          this.pred = this.hpResponse[this.properties[i]];
          break;
        }
        if (this.properties[i] == 'evaluate') {
          this.eveluate = this.hpResponse[this.properties[i]];
          continue;
        }
        const str = 'val' + this.properties[i];
        let object: CheckBox = {
          id: i + 1,
          label: this.properties[i],
          values: this.hpResponse[this.properties[i]],
          valuesVal: this.hpResponse[str],  
          isChecked: true
        }
        this.inputCheckBoxes.push(object);
        console.log(this.inputCheckBoxes);
      }
    
      this.fetchSelectedGraphics();

      
      
      });
      
      this.prikazGrafika=true;
      this.spiner.setShowSpinner(true);

      this.scrollToResults("loaderStatistika");
      // spusti prikaz na spiner
      //alert("spusti se na loader");
    }

  countLayers=0;
  counterNeuron = 0;
  onAddLayer() {
    if(this.countLayers<7){
      this.countLayers++;
      this.activacioneFunkc.push('sigmoid');
      const control = new FormControl(new FormArray([]));
      (<FormArray>this.hyperparametersForm.get('neurons')).push(control);
    }
  }

  onRemoveLayer() {
    if(this.countLayers>1){
      this.countLayers--;
      this.activacioneFunkc.pop();
      (<FormArray>this.hyperparametersForm.get('neurons')).removeAt(this.countLayers);
    }
  }

  activacioneFunkc:Array<string>=[];
  ActivationFuncChange(data:any, i:number)
  {
    this.activacioneFunkc[i]=data.target.value;
  }

  neuronsLength:Array<number>=[]; 
  countAllNeurons(){
    this.neuronsLength=[];
    for(let i=0;i<this.countLayers;i++){
      this.neuronsLength.push((<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length+1);
    }
  }

  onAddNeuron(i:number){
    const control = new FormControl(0);
    (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.push(control);
    
  }
  onRemoveNeuron(i:number){
    (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.removeAt(this.counterNeuron -1);
    this.counterNeuron = (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length;
  }

  checkEpochs(){
    if (this.epochs === ""){ alert("Moze");return;}
    else if (this.epochs<1) this.epochs = 1;
    else if (this.epochs>100) this.epochs = 100;
  }

  countNeurons(i:number){
    return  (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length;
  }

    currentVal=0;
    getVal(val:any){
    console.warn(val)
    this.currentVal=val;
  }

  scrollToResults(id:string) {
    var results: any;
    results = document.getElementById(id);
    
    //alert("Skrolujem");
    //if (results) alert("Postoji " +id);
    //else alert("Ne postoji "+ id);

    const y = results.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
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
