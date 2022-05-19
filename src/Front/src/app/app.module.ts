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
import { NgbAlertModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { fileMinus, filePlus, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { envelope,telephone,personCircle, caretRightFill, dashCircleFill, plusCircleFill} from 'ngx-bootstrap-icons';
import { SlojeviNeuroniComponent } from './home/slojevi-neuroni/slojevi-neuroni.component';
import { MatSliderModule } from '@angular/material/slider'; 
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AboutComponent } from './about/about.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProfileComponent } from './header/profile/profile.component';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import{ToastrModule} from 'ngx-toastr';
import { SendEmailComponent } from './send-email/send-email.component';
import { HyperparametersComponent } from './home/hyperparameters/hyperparameters.component';
import { DatasetComponent } from './header/dataset/dataset.component';
import { GraphicComponent } from './graphic/graphic.component';
import { TableComponent } from './table/table.component';
import { HeatmapComponent } from './home/heatmap/heatmap.component';
import { LoadingComponent } from './loading/loading.component';
import { UserdatasetsComponent } from './home/csv/userdatasets/userdatasets.component';
import { UsermodelsComponent } from './home/hyperparameters/usermodels/usermodels.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EncodingComponent } from './encoding/encoding.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { StatisticsComponent } from './statistics/statistics.component';
import { BarplotComponent } from './barplot/barplot.component';
import { PredictionComponent } from './prediction/prediction.component';
import { PredikcijaPoModeluComponent } from './home/csv/predikcija-po-modelu/predikcija-po-modelu.component';
import{Ng2SearchPipeModule} from 'ng2-search-filter';

const icons = {
  envelope,
  telephone,
  fileMinus,
  filePlus,
  personCircle,
  caretRightFill,
  dashCircleFill,
  plusCircleFill
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
    AboutComponent,
    ProfileComponent,
    SendEmailComponent,
    HyperparametersComponent,
    DatasetComponent,
    GraphicComponent,
    TableComponent,
    HeatmapComponent,
    LoadingComponent,
    UserdatasetsComponent,
    UsermodelsComponent,
    EncodingComponent,
    StatisticsComponent,
    BarplotComponent,
    PredictionComponent,
    PredikcijaPoModeluComponent,
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
    NgxSliderModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbPaginationModule,
    NgbAlertModule,
    NgxChartsModule,
    MatButtonModule,
    MatIconModule,
    Ng2SearchPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }