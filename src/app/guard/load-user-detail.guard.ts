import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserDataService } from '../service/user-data.service';
import Constants from '../app.constants';

@Injectable()
export class LoadUserDetailGuard implements CanActivate {

  constructor(private userDataService: UserDataService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkUserServiceData();
  }

  checkUserServiceData(): boolean {
    if (this.userDataService.data.length) { return true; }

    this.router.navigate([Constants.appRoute.search]);
    return false;
  }
}
