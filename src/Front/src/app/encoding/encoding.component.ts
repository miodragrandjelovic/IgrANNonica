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
  encodings: any;
  selected: any;
  selectedEncodings: any;
  inputs: any;
  

  constructor(private parametersService: ParametersService) { }

  ngOnInit(): void {
    this.parametersService.getInputs().subscribe( res => {
      this.inputs = res;
      if(this.inputs) this.load();
    });
  }

  load() {
    this.selected = [];
    this.selectedEncodings = [];
    this.headers = [];
    this.headers = this.inputs;
    for (let i = 0; i < this.inputs.length; i++) {
      if (isNaN(this.input[0][this.inputs[i]])) {
        this.selected.push('categorical');
        this.selectedEncodings.push('one hot');
      }
      else {
        this.selected.push('numerical');
        this.selectedEncodings.push('');
      }
    }
    this.parametersService.setEncodings(this.selectedEncodings);
    this.parametersService.setCatNum(this.selected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load()
  }

  changeType(option: string, index: number) {
    this.selected[index] = option;
    if (option == 'categorical')
      this.selectedEncodings[index] = 'one hot';
    else
      this.selectedEncodings[index] = '';
      this.parametersService.setCatNum(this.selected);
      this.parametersService.setEncodings(this.selectedEncodings);
  }

  changeEncoding(value:string, index:number) {
    this.selectedEncodings[index] = value;
    this.parametersService.setEncodings(this.selectedEncodings);
  }

}
