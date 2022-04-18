import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { LoadingService } from '../loading/loading.service';

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
  @Input() id: number;
  constructor(public spiner:LoadingService) { }

  ngOnInit(): void {
    console.log('selected:', this.selected);
  }

  ngAfterViewInit(): void {
    this.loadGraphic(this.selected.label, this.selected.values, this.selected.valuesVal);
    this.spiner.showSpiner=false;
  }


  loadGraphic(str: string, hpY: Array<number>, hpY1: Array<number>) {

    console.log(str);
    console.log(hpY);
    console.log(hpY1);

    this.hpX = [];
    for (let i = 0; i < hpY.length; i++) {
      this.hpX[i] = '' + i;
      hpY[i] = parseFloat(hpY[i].toFixed(5));
      hpY1[i] = parseFloat(hpY1[i].toFixed(5));
    }
    console.log(hpY);
    console.log(hpY1);
    console.log(`ID GRAPH: ${this.id}`)
    this.ctx = document.getElementById(`${this.id}`) as HTMLCanvasElement;
    console.log(this.ctx)
      let chart = new Chart(this.ctx, {
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
