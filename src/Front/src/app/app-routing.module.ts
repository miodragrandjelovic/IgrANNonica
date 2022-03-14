import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { SredinaComponent } from './sredina/sredina.component';
import { HiperparametriComponent } from './hiperparametri/hiperparametri.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path: 'registracija', component:RegistracijaComponent},
  {path:'prijava',component:PrijavaComponent},
  {path:'sredina',component:SredinaComponent},
  {path:'hiperparametri',component:HiperparametriComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
