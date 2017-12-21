import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserDetailComponent } from '../component/user-detail/user-detail.component';

@Injectable()
export class SaveEditUserGuard implements CanDeactivate<UserDetailComponent> {
  canDeactivate(component: UserDetailComponent): boolean {
    if (component.isDirty) {
      return confirm('Discard all changes?');
    }
    return true;
  }
}

export interface CanDeactivate<T> {
  canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean;
}
