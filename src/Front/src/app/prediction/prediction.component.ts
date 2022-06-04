import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { left, right } from '@popperjs/core';
import { colorNameToHex } from '@syncfusion/ej2-angular-heatmap';
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
  regression: any = [];

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
    this.regression = [];
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
    let br = this.min;
    while (br < this.max)  {
      this.regression.push({x: br, y: br});
      br += step;
    }

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
    for(let i = 0; i < this.pred.length; i++){
      this.predArray.push(this.pred[i]);
      this.labelArray.push(this.label[i]);
      data.push({x: this.labelArray[i], y: this.predArray[i]});
    }
    this.min = Math.round(Math.min(0, ...this.predArray, ...this.labelArray));
    this.max = Math.round(Math.max(...this.predArray, ...this.labelArray));
    let step = Math.round((this.max - this.min) / 10); 
   // console.log(data);
   // console.log(data1);
   
   let br = this.min;
    while (br < this.max)  {
      this.regression.push({x: br, y: br});
      br += step;
    }

    

    this.ctx = document.getElementById('pred') as HTMLCanvasElement;
    this.chart = new Chart(this.ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: 'Real vs Predicted',
            data: data,
            yAxisID: 'y',
            backgroundColor: 'rgb(255, 99, 132)'
          },
          {
            label: 'y = x Line',
            type: 'line',
            data: this.regression,
            backgroundColor: 'blue',
            pointStyle: 'line',
            borderColor: 'blue'
          }
        ]  
      },
      options: {
        scales: {
          y: {
            position: left,
            title: {
              display: true,
              text: 'Predicted'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Real'
            }
          }
        },
        responsive: true,
        maintainAspectRatio:false,
      }
    });
  }

}
