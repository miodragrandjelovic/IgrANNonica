import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../home.service';


@Component({
  selector: 'app-predikcija-po-modelu',
  templateUrl: './predikcija-po-modelu.component.html',
  styleUrls: ['./predikcija-po-modelu.component.css']
})
export class PredikcijaPoModeluComponent implements OnInit {

  hidden:boolean;

  constructor(private service : MessageService) { }

  ngOnInit(): void {
    this.service.messageSubject.subscribe({
      next: x => {
        if (x == 0 || x==1 || x == 2)
        {
          this.hidden = false;
          //alert("IM HIDDEN");
        }
        else{
          this.hidden = true;
        }
      }
    });

  }

}
