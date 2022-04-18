import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  constructor() { }

  @Input() result: string; // ovo je json korelacione matrice

  ngOnInit(): void {
  }

}
