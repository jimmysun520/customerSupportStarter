import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdalService } from 'ng2-adal/dist/core';
import Constants from '../../app.constants';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private adalService: AdalService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const navigationExtras: NavigationExtras = {
      queryParams: { 'redirectUrl': next.url }
    };
    if (this.adalService.userInfo.isAuthenticated) { return true; }

    this.router.navigate([Constants.appRoute.login], navigationExtras);
    return false;
  }
}
