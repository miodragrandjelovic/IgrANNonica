import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CsvComponent } from 'src/app/home/csv/csv.component';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  personImg:string="assets/images/person.jpg";

}
