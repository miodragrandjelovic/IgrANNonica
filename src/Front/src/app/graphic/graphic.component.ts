import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit, OnDestroy {

  @Input() selected: any = [];
  ctx: any;
  chart: any;
  hpX: Array<string> = [];
  charts: any = [];
  @Input() id: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadGraphic(this.selected.label, this.selected.values, this.selected.valuesVal);
  }

  ngOnDestroy(): void {
    let el = document.getElementById(this.id+'');
    el?.remove();
  }


  loadGraphic(str: string, hpY: Array<number>, hpY1: Array<number>) {

    this.hpX = [];
    for (let i = 0; i < hpY.length; i++) {
      this.hpX[i] = '' + i;
      hpY[i] = parseFloat(hpY[i].toFixed(5));
      hpY1[i] = parseFloat(hpY1[i].toFixed(5));
    }

    this.ctx = document.getElementById(`${this.id}`) as HTMLCanvasElement;
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.hpX,
          datasets: [{
            data: hpY,
            fill: false,
            label: str,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            yAxisID: 'y'
            },
            {
              data: hpY1,
              label: 'val' + str,
              backgroundColor: 'rgb(99, 122, 255)',
              borderColor: 'rgb(99, 122, 255)',
              yAxisID: 'y1'
            }]
          },
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Epochs'
              }
            },
            y: {
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Value'
              }
            },
            y1: {
              display: true,
              position: 'right'
            }
          }
        }
      });
      return this.chart;
  }

}
