import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-barplot',
  templateUrl: './barplot.component.html',
  styleUrls: ['./barplot.component.css']
})
export class BarplotComponent implements OnInit, OnChanges {

  @Input() evaluate: any = [];
  hpX: Array<string>;
  hpY: Array<number>;
  chart: any;
  ctx: any;

  constructor(private spiner: LoadingService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.spiner.setShowSpinner(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.hpX = [];
    this.hpY = [];
    this.hpX = Object.keys(this.evaluate);
    for (let i = 0; i < this.hpX.length; i++) {
      this.hpY.push(this.evaluate[this.hpX[i]]);
    }
    this.loadBarplot();
  }

  loadBarplot() {
    this.ctx = document.getElementById('id') as HTMLCanvasElement;
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.hpX,
        datasets:  [{
          label: 'Evaluate Barplot',
          data: this.hpY,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderWidth: 1
        }]

      },
      options:{
        responsive: true,
        maintainAspectRatio:false,
      }
    })
  }


}