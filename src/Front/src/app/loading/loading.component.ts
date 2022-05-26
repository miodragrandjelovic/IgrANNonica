import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  show: boolean = false;

  constructor(public spiner:LoadingService) { }

  ngOnInit(): void {
    // fokus na spiner
    
    this.spiner.getShowSpinner().subscribe(newValue => {
      this.show = newValue;
    });

    

    //alert("spustam se na loader");
    //document.getElementById("loaderStatistika")?.focus(); 
  }

}
