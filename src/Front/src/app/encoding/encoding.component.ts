import { Component, OnInit ,OnChanges, Input, SimpleChanges} from '@angular/core';
import { select } from 'd3-selection';

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
  

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.selected = [];
    this.selectedEncodings = [];
    this.headers = [];
    this.headers = Object.keys(this.input[0]);
    for (let i = 0; i < this.headers.length; i++) {
      if (isNaN(this.input[0][this.headers[i]])) {
        this.selected.push('categorical');
        this.selectedEncodings.push('one hot');
      }
      else {
        this.selected.push('numerical');
        this.selectedEncodings.push('');
      }
    }
    console.log(this.selected);
    console.log(this.selectedEncodings);
  }

  changeType(option: string, index: number) {
    this.selected[index] = option;
    console.log(this.selected);
    if (option == 'categorical')
      this.selectedEncodings[index] = 'one hot';
    else
      this.selectedEncodings[index] = '';
    console.log(this.selectedEncodings);
  }

  changeEncoding(value:string, index:number) {
    this.selectedEncodings[index] = value;
    console.log(this.selected)
    console.log(this.selectedEncodings);
  }

}
