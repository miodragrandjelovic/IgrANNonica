import { Component, OnInit ,OnChanges, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnChanges {

  constructor() { }

  header:any;
  rowLines:any;

  @Input() result: string; // ovo je json korelacione matrice

  ngOnChanges(changes: SimpleChanges): void {

    console.log("Korelaciona koju dobijamo ", this.result);
    //console.log("PARSIRANO ",JSON.parse(this.result));
  }



}
