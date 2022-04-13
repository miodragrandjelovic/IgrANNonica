import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {

  @Input() selected: any = [];
  ctx: any;
  hpX: Array<string> = [];
  charts: any = [];
  constructor() { }

  ngOnInit(): void {
    console.log('selected:', this.selected);
    for (let i = 0; i < this.selected.length; i++) {
      this.charts.push(this.loadGraphic(this.selected[i].label, this.selected[i].values, this.selected[i].valuesVal)); 
    }
  }

  loadGraphic(str: string, hpY: Array<number>, hpY1: Array<number>) {

    console.log(str);
    console.log(hpY);
    console.log(hpY1);

    this.hpX = [];
    for (let i = 0; i < hpY.length; i++) {
      this.hpX[i] = '' + i;
    }
    this.ctx = document.getElementById('0') as HTMLCanvasElement;
      let chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.hpX,
          datasets: [{
            data: hpY,
            fill: false,
            label: 'Loss',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            yAxisID: 'y'
            },
            {
              data: hpY1,
              label: 'valLoss',
              backgroundColor: 'rgb(99, 122, 255)',
              borderColor: 'rgb(99, 122, 255)',
              yAxisID: 'y1'
            }]
          },
        options: {
          responsive: true,
          scales: {
            y: {
              display: true,
              position: 'left',
            },
            y1: {
              display: true,
              position: 'right'
            }
          }
        }
      });
      return chart;
  }

}
