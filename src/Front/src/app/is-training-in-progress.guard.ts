import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from './home/home.component';


@Injectable({
  providedIn: 'root'
})
export class IsTrainingInProgressGuard implements CanDeactivate<HomeComponent> {

  canDeactivate(
    component: HomeComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (component.isTrainingInProgress()){
        return true;
      }
      else{
        return window.confirm("Training is still in progress, if you leave, results will not be saved! Do you want to continue?");
        
      }
    }
}
