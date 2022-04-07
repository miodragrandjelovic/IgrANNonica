import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import{ProfileComponent} from './header/profile/profile.component';
import { AuthGuardService } from './auth-guard.service';
import { SendEmailComponent } from './send-email/send-email.component';
import { HyperparametersComponent } from './home/hyperparameters/hyperparameters.component';
import{DatasetComponent} from './header/dataset/dataset.component';

const routes: Routes = [
  {path:'', component:NavigationComponent},
  {path:'home', component:HomeComponent},
  {path:'about',component:AboutComponent},
  {path:'profile',component:ProfileComponent,
  canActivate:[AuthGuardService]},
  {path:'send-email',component:SendEmailComponent},
  {path:'hyperparameters',component:HyperparametersComponent}
  {path:'dataset',component:DatasetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
