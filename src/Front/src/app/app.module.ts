import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CsvComponent } from './home/csv/csv.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { fileMinus, filePlus, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { envelope,telephone} from 'ngx-bootstrap-icons';
import { SlojeviNeuroniComponent } from './home/slojevi-neuroni/slojevi-neuroni.component';
import { MatSliderModule } from '@angular/material/slider'; 
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AboutComponent } from './about/about.component';

const icons = {
  envelope,
  telephone,
  fileMinus,
  filePlus
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegistracijaComponent,
    PrijavaComponent,
    HomeComponent,
    CsvComponent,
    SlojeviNeuroniComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxBootstrapIconsModule.pick(icons),
    MatSliderModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }