import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { left, right } from '@popperjs/core';
import { Chart } from 'chart.js';
import { NumberValue } from 'd3-scale';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit, OnChanges {

  @Input() pred: any;
  @Input() label: any;
  
  predArray: Array<number>;
  labelArray: Array<number>;
  x: Array<number>;
  ctx:any;
  chart: any;
  min: number;
  max: number;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.predArray = [];
    this.labelArray = [];
    this.x = [];
    let data = [];
    let data1 = [];
    for(let i = 0; i < this.pred.length; i++){
      this.predArray.push(this.pred[i][0]);
      this.labelArray.push(this.label[i][0]);
      data.push({x: i+1, y: this.predArray[i]});
      data1.push({x: i+1, y: this.labelArray[i]});
    }
    this.min = Math.min(0, ...this.predArray, ...this.labelArray);
    this.max = Math.max(...this.predArray, ...this.labelArray);
    let step = (this.max - this.min) / 10; 

    this.ctx = document.getElementById('pred') as HTMLCanvasElement;
    this.chart = new Chart(this.ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Predicted',
            data: data,
            yAxisID: 'y',
            backgroundColor: 'rgb(255, 99, 132)'
          },
          {
            label: 'Real',
            data: data1,
            backgroundColor: 'rgb(99, 122, 255)',
            yAxisID: 'y1'
          }
        ]  
      },
      options: {
        scales: {
          y: {
            position: left
          },
          y1: {
            position: right
          }
        },
        responsive: true,
        maintainAspectRatio:false,
      }
    });
  }

}
