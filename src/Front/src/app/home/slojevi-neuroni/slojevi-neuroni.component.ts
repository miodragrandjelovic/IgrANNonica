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
  tekst:any="";
 
  counter(type:any){

    if(type==='add'){
      this.count++;
      this.tekst++;
    }  
    else if(type==='minus'){
      this.count--;
      this.tekst=this.tekst.slice(0,this.count,-1);
     
    }  
    for(let i=0;i<this.count;i++){
     this.tekst+="<input type='text' name='layer"+(i+1)+"'>";
    }
  }
 
  public get input() : SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.tekst);
 }

}