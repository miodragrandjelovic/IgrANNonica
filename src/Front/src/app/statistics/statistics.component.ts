import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnChanges {

  @Input() result: any;
  headers: any;
  rowLinesStatistics: any;
  headersStatistics: any = ['Columns', 'min', 'Q1', 'Q2', 'Q3', 'max',  'mean', 'std', 'count', 'freq', 'top', 'unique'];

  constructor() { 

  }

  ngOnInit(): void {
    
  }

  roundNumbers(num:any){
    if (num%1 === 0)
    {//broj je ceo
      return num;
    }
    else{
      return num.toFixed(3);
    }
  }

  ngOnChanges() {
 //   console.log(this.result);
    this.headers = Object.keys(this.result);
    this.rowLinesStatistics = [];
    for(let i = 0; i < this.headers.length; i++) {
      const currentRow = [this.headers[i],
          this.result[this.headers[i]].min ? this.roundNumbers(this.result[this.headers[i]].min) : '-', 
          this.result[this.headers[i]].Q1 ? this.roundNumbers(this.result[this.headers[i]].Q1) : '-',
          this.result[this.headers[i]].Q2 ? this.roundNumbers(this.result[this.headers[i]].Q2) : '-', 
          this.result[this.headers[i]].Q3 ? this.roundNumbers(this.result[this.headers[i]].Q3) : '-', 
          this.result[this.headers[i]].max ? this.roundNumbers(this.result[this.headers[i]].max) : '-',
          this.result[this.headers[i]].mean ? this.roundNumbers(this.result[this.headers[i]].mean) : '-', 
          this.result[this.headers[i]].std ? this.roundNumbers(this.result[this.headers[i]].std) : '-', 
          this.result[this.headers[i]].count ? this.result[this.headers[i]].count : '-',
          this.result[this.headers[i]].freq ? this.result[this.headers[i]].freq : '-', 
          this.result[this.headers[i]].top ? this.result[this.headers[i]].top : '-', 
          this.result[this.headers[i]].unique ? this.result[this.headers[i]].unique : '-'
      ];
      this.rowLinesStatistics.push(currentRow);
    }
 //   console.log(this.rowLinesStatistics);
  }
}
