import { Component, OnInit ,OnChanges, Input, SimpleChanges} from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';


interface DataItem {
  name: string,
  value: number
}

interface Data {
  name: string,
  series: DataItem[]
}

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnChanges {

  constructor() { }

  legend: boolean = true;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Time,
    domain: ['#69add5','#ffffff', '#69add5'],
  };

  labels:any;
  datasets: Data [];

  @Input() matrix: string; // ovo je json korelacione matrice

  ngOnChanges(changes: SimpleChanges): void {

    this.datasets = [];
    this.labels = Object.keys(this.matrix);
    console.log(this.labels);
    console.log(this.matrix[this.labels[0]][this.labels[0]]);
    
    for (let i = 0; i < this.labels.length; i++) {
      const dataItems:DataItem[] = [];
      for(let j = this.labels.length - 1; j >= 0; j--){
        const dataObject:DataItem = { name: this.labels[j], value:parseFloat(this.matrix[this.labels[i]][this.labels[j]]) }
        dataItems.push(dataObject);
      }
      this.datasets.push({ name: this.labels[i], series: dataItems });
    }
    console.log(this.datasets);
  }
  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  
  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
