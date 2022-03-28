import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PrijavaService } from './prijava/prijava.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private prijavaService: PrijavaService, 
    private router: Router) { }

    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    if(!this.prijavaService.isAuthenticated())
    {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
