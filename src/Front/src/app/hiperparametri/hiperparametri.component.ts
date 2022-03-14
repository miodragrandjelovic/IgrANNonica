import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-hiperparametri',
  templateUrl: './hiperparametri.component.html',
  styleUrls: ['./hiperparametri.component.css']
})
export class HiperparametriComponent implements OnInit {


  hiperparametri=[
    {
      path:'/learning-rate',
      name:'Learning rate',
      subItems:[
        {
          path:'/',
          name:'nesto'
        },
      ]
    },
    {
      path:'/activation',
      name:'Activation'
    },
    {
      path:'/regularization',
      name:'Regularization'
    },
    {
      path:'/regularization-rate',
      name:'Regularization rate'
    },
    {
      path:'/problem-type',
      name:'Problem type'
    }
  ]

  constructor(private service:SharedService) { }


  ngOnInit(): void {
    }
  

}
