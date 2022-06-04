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
import { RefreshService } from 'src/app/home/hyperparameters/usermodels/usermodels.service';
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as myUrls from 'src/app/urls';
import { UsermodelsComponent } from './usermodels/usermodels.component';
import { catchError } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { CsvService} from '../csv/csv.service'
import { TargetService } from 'src/app/table/table.service'
import { Target } from '@angular/compiler';


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

  //@ViewChild(UsermodelsComponent) child:UsermodelsComponent;

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
  hidden: boolean=true;
  value1: number = 80;
  value2: number = 16;
  value3: number = 50;
  //dodato za default vrednosti
  lrate: number = 0.001;
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
  listOfNeurons: Array<any> = [1,1,1,1,1,1,1];
  //layers:Array<string> = ["5","5","5","5","5"]
  //
  activationFunctions:Array<any>=[];
  modelName: any = '';
  modelVisibility: any = 'private';

  session:any;
  prikazGrafika=false;
  show: boolean = false;

  problem: string;

  options1: Options = {
    floor: 5,
    ceil: 95,
    step: 5
  };
  
  steps = [{value: 2}, {value:4}, {value:8}, {value:16}, {value:32}, {value:64}];

  options2: Options = {
    stepsArray: this.steps.map((s): CustomStepDefinition => {
      return { value: s.value };
    })
  };

  options3: Options = {
    floor: 5,
    ceil: 95,
    step: 5
  };

  hyperparametersForm!: FormGroup;
  onemogucenSave:boolean;
  onemogucenChange:boolean;

  constructor(private http: HttpClient, public spiner:LoadingService, public refreshModels : RefreshService,
    private toastr:ToastrService,private parametersService: ParametersService, private service : MessageService, 
    private modalService: NgbModal, private csvservis: CsvService, private targetService: TargetService) {
    Chart.register(...registerables);
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title);
   } 
  public url = myUrls.url;
  get neuronControls() {
    return (<FormArray>this.hyperparametersForm.get('neurons')).controls;
   }

   listaNeurona(i:number) {
     //alert((<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value);
    return (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value;
   }

  chosenDataset:string = "";
  chosenTarget:string="";

  ngOnInit(): void {
    this.onemogucenSave = true;
    this.onemogucenChange = false;
    
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
      'modelName':new FormControl(null)
    });

    this.parametersService.getParamsObs().subscribe(res => {
      this.hyperparameters = res;
    });

    this.service.messageSubject.subscribe({
      next: x => {
        if (x == 0 || x==3 || x == 2)
        {
          this.hidden = true;
          //alert("IM HIDDEN");
        }
        else{
          this.hidden = false;
        }
      }
    });

    //argitektura od 3 sloja
    for (let j=0;j<3;j++){
      this.onAddLayer();
    }

    // subscribe za ime modela
    this.csvservis.datasetname.subscribe({
      next: name => {
        //console.error("GETOVAO SAM IME");
        //alert("Getovano ime "+name);
        this.chosenDataset = name;
      }
    });

    // subscribe za target
    this.targetService.chosenTarget.subscribe({
      next: target => {
        //console.error("GETOVAO SAM IME");
        //alert("Getovano ime "+name);
        this.chosenTarget = target;
      }
    });
    
    this.session=sessionStorage.getItem('username');
    if (!this.session){
      // ako nije ulogovan uzmi def dataset
      this.chosenDataset = this.csvservis.getDatasetName();
    }

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

  onNeuronChange(event:any,i:number){
    this.listOfNeurons[i] = event.target.value;
    if(event.target.value!=""){
      this.checkNeurons(i);
    }
  }

  layerLeaveFocus(event:any,i:number){
    if(event.target.value==""){
      this.listOfNeurons[i] = 1;
      this.makeLayer(i);
    }
  }

  showCsv() {
    this.parametersService.setShowHp(false);
  }

  disableChanges(){
    this.onemogucenChange = true;
    //onemoguci prelazak na Load Data stranu
    this.service.disableClick(true);
  }

  enableChanges(){
    this.onemogucenChange = false;
    //omoguci prelazak na Load Data stranu
    this.service.disableClick(false);
  }

  onSubmitHyperparameters() {

    // kada se zapocne trening ONEMOGUCITI IZMENU HIPERPARAMTERA I PODATAKA 
    
    this.inputsString = '';
    this.outputString = '';
    const layers = (<FormArray>this.hyperparametersForm.get('neurons')).controls.length;
    //alert(layers);
    const neurons = (<FormArray>this.hyperparametersForm.get('neurons')).controls;
    //alert(neurons);
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

  if (this.epochs == null)
  {
    //alert("epochs prazan");
    this.hyperparametersForm.get('epoch')?.setValue(5);
  }
  // takodje ako nije setovan dataset ili target, da ne moze da se trenira
  if (this.chosenDataset == ""){
    this.toastr.error("You need to choose dataset on Load Data page!", "Training Error");
  }
  else if (this.chosenTarget == "" || this.outputString==""){
    this.toastr.error("You need to choose Target for dataset on Load Data page!", "Training Error");
  }
  else if (this.inputsString==""){
    this.toastr.error("You need to choose at least one Input for dataset on Load Data page!", "Training Error");
  }
  else{
    this.parametersService.getProblemType().subscribe((result) => {
      if (result == true)
        this.problem = 'regression';
      else
        this.problem = 'classification';
    });
    const myreq: RequestHyperparameters = {
      learningRate : Number(this.hyperparametersForm.get('learningRate')?.value),
      epoch: this.hyperparametersForm.get('epoch')?.value,
      regularization: this.hyperparametersForm.get('regularization')?.value,
      regularizationRate: Number(this.hyperparametersForm.get('regularizationRate')?.value),
      problemType: this.problem,
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
    
    var loggedUsername = sessionStorage.getItem('username');
    //alert(myreq.numberOfNeurons);
    // ONEMOGUCI
    this.disableChanges();

    this.http.post(this.url + '/api/LoadData/hpNeprijavljen?Username='+loggedUsername+'&CsvFile='+this.chosenDataset, myreq).subscribe(result => {
    
     // console.log("Rezultat slanja HP treninga je "  + result);
      // kada se zavrsi trening OMOGUCITI PONOVO IZMENU HIPERPARAMTERARA!
      this.enableChanges();

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
        //console.log(this.inputCheckBoxes);
      }
    
      this.fetchSelectedGraphics();

      
      
      });
      
      this.prikazGrafika=true;
      this.spiner.setShowSpinner(true);

      this.scrollToResults("loaderStatistika");
      // spusti prikaz na spiner
      //alert("spusti se na loader");
  }

  }

  countLayers=0;
  counterNeuron = 0;
  onAddLayer() {
    if(this.countLayers<7){
      this.countLayers++;
      this.listOfNeurons[(this.countLayers - 1)]=1;
      this.activacioneFunkc.push('sigmoid');
      const control = new FormControl(new FormArray([]));
      (<FormArray>this.hyperparametersForm.get('neurons')).push(control);
      //po 5 neurona da ima svaki nov sloj!
      //alert("Dodajem sloju "+(this.countLayers-1)+" neurone!");
      for (let i=1;i<5;i++){
        this.onAddNeuron(this.countLayers-1);
      }
    }
  }

  onRemoveLayer() {
    if(this.countLayers>1){
      this.countLayers--;
      this.activacioneFunkc.pop();
      (<FormArray>this.hyperparametersForm.get('neurons')).removeAt(this.countLayers);
      this.listOfNeurons[(this.countLayers)] = 0;
    }
  }

  activacioneFunkc:Array<string>=[];
  ActivationFuncChange(data:any, i:number)
  {
    this.activacioneFunkc[i]=data.target.value;
  }



  moreThanNine(i:number){
    if((<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length+1 > 9)
      return true;
    else
      return false;
  }

  moreThanTen(i:number){
    if((<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length+1 > 10)
      return true;
    else
      return false;
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
    this.listOfNeurons[i]++;
  }
  onRemoveNeuron(i:number){
    (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.removeAt(this.counterNeuron -1);
    this.counterNeuron = (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length;
    this.listOfNeurons[i]--;
  }

  checkEpochs(){
    //alert("Len " + this.epochs);
    if (this.epochs == null){ 
      //alert("Moze");
      return;
    }
    else if (this.epochs<1){
      this.epochs = 1;
    }
    else if (this.epochs>100){
      this.epochs = 100;
    }
  }

  

  checkNeurons(i:number){
    //alert("Check layer "+i);
    //alert("Len " + this.epochs);
    if (this.listOfNeurons[i] == null){ 
      //alert("Moze");
      return;
    }
    else if (this.listOfNeurons[i]<1){
      //alert("manje od nule");
      this.listOfNeurons[i] = 1;
    }
    else if (this.listOfNeurons[i]>256){
      this.listOfNeurons[i] = 256;
    }
    this.makeLayer(i);
  }

  makeLayer(i:number){
    //+1 jer imamo onaj jedan prvi
    //alert("Current number "+(this.countNeurons(i) + 1));
    //alert("New number "+this.listOfNeurons[i]);
    //alert(((this.countNeurons(i)+1) === (this.listOfNeurons[i])));
    if ((this.countNeurons(i)+1) < (this.listOfNeurons[i])){
      //povecaj dok se ne izjednace  
      //alert("Treba da povecas");
      const control = new FormControl(0);
      (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.push(control);
      while(((this.countNeurons(i)+1) < (this.listOfNeurons[i]))){
        //alert("Current number "+(this.countNeurons(i) + 1));
        //alert("New number "+this.listOfNeurons[i]);
        const control = new FormControl(0);
      (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.push(control);
      }
    }
    if ((this.countNeurons(i)+1) > (this.listOfNeurons[i])){
      //smanji dok se ne izjednace  
      //alert("Treba da smanjis");
      (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.removeAt(this.counterNeuron -1);
      this.counterNeuron = (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length;
      while(((this.countNeurons(i)+1) > (this.listOfNeurons[i]))){
        //alert("Current number "+(this.countNeurons(i) + 1));
        //alert("New number "+this.listOfNeurons[i]);
        (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.removeAt(this.counterNeuron -1);
      this.counterNeuron = (<FormArray>this.hyperparametersForm.get('neurons')).controls[i].value.value.length;
      }
    }
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

    
    saveModel() {
      this.onemogucenSave = true;
      let loggedUsername = sessionStorage.getItem('username');
      this.http.post(this.url + `/api/LoadData/save?modelNames=${this.modelName}&publicModel=${this.modelVisibility=='public' ? 'true' : 'false'}` + `&Username=${loggedUsername}`+'&upgradedName='+this.chosenDataset, 
      undefined, { responseType: 'text' }).subscribe(result => {
        
        //alert("Sacuvano!");
        //korisnik treba da bude obavesten o tome da je uspesno sacuvan model
        this.toastr.success('Model saved successfuly!');
        
        // ovde treba da se pozove refresh usermodels komponente koja se nalazi u predikcija po modelu !!
        // medjutim ovo vise nije child, pa ne moze ovako!
        //this.child.ngOnInit();
        this.refreshModels.sayMessage(1);

        this.modelName = "";
      }, error=>{
        this.toastr.error("Could not save model, please try again!");
      });
    }

    modelNameChange(newValue: any) {
      this.modelName = (newValue.target as HTMLInputElement).value;

      //alert("Model name "+ this.modelName);
      if (this.modelName != "")
      {
        this.onemogucenSave = false;
      }
      else
      {
        //alert("Prazan str");
        this.onemogucenSave = true;
      }
      
    }
    modelSelectChange(selectedValue: any) {
      this.modelVisibility = (selectedValue.target as HTMLInputElement).value;
    }


}
