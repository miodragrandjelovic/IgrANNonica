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
    console.log("DUZINA KORELACIONE ", this.result.length);

    this.header = [];
    this.rowLines = [];

    for (var i=0; i< this.result.length; i++)
    {
      if (i == 0){ // ovo je header
        var headingLine = Object.keys(this.result[i]);
        console.log("HEADER",headingLine);
        for (var j=0; j<headingLine.length; j++)
        {
          this.header.push(headingLine[j]);
        }

        //console.log(this.header);
      }
       // ovo su linije
        var line = Object.values(this.result[i]);
        //console.log(line);
        var rowLine = [];
        for (var j = 0 ; j < line.length; j ++)
        {
            rowLine.push(line[j]);
        }

    }
  }



}
