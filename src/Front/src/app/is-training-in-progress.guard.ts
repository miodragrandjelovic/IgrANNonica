import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { LeavedialogueComponent } from './leavedialogue/leavedialogue.component';


@Injectable({
  providedIn: 'root'
})
export class IsTrainingInProgressGuard implements CanDeactivate<HomeComponent> {

  constructor(private dialog: MatDialog){}
  
  canDeactivate(
    component: HomeComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (component.isTrainingInProgress()){
        return true;
      }
      else{
        //return window.confirm("Training is still in progress, if you leave, results will not be saved! Do you want to continue?");
        const dialogRef = this.dialog.open(LeavedialogueComponent);
        return dialogRef.afterClosed()
      }
    }
}
