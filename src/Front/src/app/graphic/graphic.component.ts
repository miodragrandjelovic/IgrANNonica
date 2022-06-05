import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { LoadingService } from '../loading/loading.service';

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
  constructor(public spiner:LoadingService) { }

  ngOnInit(): void {
    console.log(this.selected);
  }

  ngAfterViewInit(): void {
    this.loadGraphic(this.selected.label, this.selected.values, this.selected.valuesVal);
    this.spiner.setShowSpinner(false);
  }

  ngOnDestroy(): void {
    let el = document.getElementById(this.id+'');
    el?.remove();
  }


  loadGraphic(str: string, hpY: Array<string>, hpY1: Array<string>) {

    console.log(str);
    console.log(hpY);
    console.log(hpY1);
    let hpYchart = [];
    let hpY1chart = [];
    let hpXchart = [];

    this.hpX = [];
    if (hpY.length < 31) {
      for (let i = 0; i < hpY.length; i++) {
        this.hpX[i] = '' + Number(i + 1);
        hpY[i] = parseFloat(hpY[i]).toFixed(5);
        hpY1[i] = parseFloat(hpY1[i]).toFixed(5);
      }
      hpXchart = [...this.hpX];
      hpYchart = [...hpY];
      hpY1chart = [...hpY1];
    }
    else {
      for (let i = 0; i <= hpY.length; i+=5) {
        if (i == 0) {
          hpXchart.push('' + Number(i + 1));
          // this.hpX[i] = '' + Number(i + 1);  
        } else {
          hpXchart.push('' + Number(i))
          // this.hpX[i] = '' + Number(i);
        }
        // hpY[i] = parseFloat(hpY[i]).toFixed(5);
        // hpY1[i] = parseFloat(hpY1[i]).toFixed(5);
        hpYchart.push(parseFloat(hpY[i]).toFixed(5));
        hpY1chart.push(parseFloat(hpY1[i]).toFixed(5));
    }

    console.log(hpY.length - 1);
    if (hpY.length % 5 != 0) {
      hpXchart.push('' + Number(hpY.length));
      hpYchart.push(parseFloat(hpY[hpY.length - 1]).toFixed(5));
      hpY1chart.push(parseFloat(hpY1[hpY.length - 1]).toFixed(5));
    }
  }

    this.ctx = document.getElementById(`${this.id}`) as HTMLCanvasElement;
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: hpXchart,
          datasets: [{
            data: hpYchart,
            fill: false,
            label: str,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            yAxisID: 'y'
            },
            {
              data: hpY1chart,
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
          maintainAspectRatio:false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Epochs'
              },
              ticks:{
                autoSkip:false,
                stepSize: 5
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
