import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { left, right } from '@popperjs/core';
import { Chart } from 'chart.js';
import { NumberValue } from 'd3-scale';
import { LoadingService } from '../loading/loading.service';

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

  constructor(private spiner: LoadingService) { }

  ngOnInit(): void {
    this.loadPred();
  }

  ngAfterViewInit(): void {
    this.spiner.setShowSpinner(false);
  }

  ngOnChanges(): void {
    this.updatePred();
  }

  updatePred() {
  //  console.log(this.pred);
    this.predArray = [];
    this.labelArray = [];
    this.x = [];
    let data: any = [];
    let data1 = [];
    for(let i = 0; i < this.pred.length; i++){
      this.predArray.push(this.pred[i]);
      this.labelArray.push(this.label[i]);
      data.push({x: i+1, y: this.predArray[i]});
      data1.push({x: i+1, y: this.labelArray[i]});
    }
    this.min = Math.min(0, ...this.predArray, ...this.labelArray);
    this.max = Math.max(...this.predArray, ...this.labelArray);
    let step = (this.max - this.min) / 10;

    this.chart.data.datasets.forEach((dataset: any) => {
      dataset.data.push(data);
    })
    this.chart.update();    
  }

  loadPred() {
   // console.log(this.pred);
    this.predArray = [];
    this.labelArray = [];
    this.x = [];
    let data = [];
    let data1 = [];
    for(let i = 0; i < this.pred.length; i++){
      this.predArray.push(this.pred[i]);
      this.labelArray.push(this.label[i]);
      data.push({x: i+1, y: this.predArray[i]});
      data1.push({x: i+1, y: this.labelArray[i]});
    }
    this.min = Math.min(0, ...this.predArray, ...this.labelArray);
    this.max = Math.max(...this.predArray, ...this.labelArray);
    let step = (this.max - this.min) / 10; 
   // console.log(data);
   // console.log(data1);

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
