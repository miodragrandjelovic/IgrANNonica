import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-slojevi-neuroni',
  templateUrl: './slojevi-neuroni.component.html',
  styleUrls: ['./slojevi-neuroni.component.css'],
})


export class SlojeviNeuroniComponent implements OnInit {

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
  }

  count=0;
  tekst:any='';

  counter(type:any){

    if(type==='add'){
      this.count++;
      this.tekst++;
    }  
    if(type==='minus'){
      this.count--;
      this.tekst--;
    }   
    for(let i=0;i<this.count;i++){
      this.tekst= this.tekst+" Sloj"+(i+1)+" <input type='text' name='layer"+(i+1)+"'> <br>";
    }
  }
  public get input() : SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.tekst);
 }


}