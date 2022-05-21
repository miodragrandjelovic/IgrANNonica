import { Component, OnInit ,OnChanges, Input, SimpleChanges} from '@angular/core';
import { select } from 'd3-selection';
import { ParametersService } from '../services/parameters.service';

@Component({
  selector: 'app-encoding',
  templateUrl: './encoding.component.html',
  styleUrls: ['./encoding.component.css']
})
export class EncodingComponent implements OnInit, OnChanges {

  @Input() input: any;
  headers: any;
  options: any;
  selected: any;
  encodings: any;
  selectedEncodings: any;
  inputs: any;
  columNames: any;
  catNum: any;
  startArray: any;
  startArrayType: any;
  missingValues: any;
  

  constructor(private parametersService: ParametersService) { }

  ngOnInit(): void {
    this.parametersService.getInputs().subscribe( res => {
      this.inputs = res;
      if(this.inputs) this.load();
    });
  }

  load() {
    this.missingValues = [];
    this.startArrayType = [];
    this.startArray = [];
    this.encodings = [];
    this.catNum = [];
    this.columNames = [];
    this.selected = [];
    this.selectedEncodings = [];
    this.headers = [];
    this.headers = this.inputs;
    for (let i = 0; i < this.inputs.length; i++) {
      if (isNaN(this.input[0][this.inputs[i]])) {
     //   console.log(this.headers[i]);
        this.selected.push('categorical');
        this.encodings.push('one hot')
        this.selectedEncodings.push('one hot');
        this.columNames.push(this.headers[i]);
        this.startArray.push('categorical');
        this.startArrayType.push(true);
        this.missingValues.push('top');
      }
      else {
        this.missingValues.push('mean');
        this.selected.push('numerical');
        this.startArray.push('numerical');
        this.encodings.push('');
        this.startArrayType.push(false);
      }
    }
    this.parametersService.setEncodings(this.selectedEncodings);
    this.parametersService.setColumNames(this.columNames);
    this.parametersService.setCatNum(this.catNum);
    this.parametersService.setMissingValues(this.missingValues);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load()
  }

  changeType(option: string, index: number) {
    if (option == 'categorical' && this.selected[index] == 'numerical') {
      this.selected[index] = option;
      this.catNum.push(this.headers[index]);
      this.parametersService.setCatNum(this.catNum);
      this.missingValues[index] = 'top';
    }
    else if (option == 'numerical' && this.selected[index] == 'categorical') {
      this.missingValues[index] = 'mean';
      this.startArray[index] = 'numerical';
      this.selected[index] = 'numerical';
      for (let i = 0; i < this.catNum.length; i++) {
        if (this.catNum[i] == this.headers[index]) {
          for (let j = i; j < this.catNum.length - 1; j++)
            this.catNum[j] = this.catNum[j + 1];
          this.catNum = this.catNum.slice(0, this.catNum.length - 1);
        }
      }
      this.parametersService.setCatNum(this.catNum);
      this.parametersService.setMissingValues(this.missingValues);
      this.encodings[index] = '';
    }
  }

  changeMissingValues(value: string, index: number) {
    this.missingValues[index] = value;
    this.parametersService.setMissingValues(this.missingValues);
  }

  changeEncoding(value:string, index:number) {
    for (let i = 0; i < this.columNames.length; i++) {
      if (this.columNames[i] == this.headers[index])
        this.selectedEncodings[i] = value;
    }
    this.parametersService.setEncodings(this.selectedEncodings);
  }

}
