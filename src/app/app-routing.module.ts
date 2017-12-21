import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { SearchComponent } from './component/search/search.component';
import { UsersComponent } from './component/users/users.component';
import { UserDetailComponent } from './component/user-detail/user-detail.component';

import { SaveEditUserGuard } from './guard/save-edit-user.guard';
import { LoadUserDetailGuard } from './guard/load-user-detail.guard';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';

import Constants from './app.constants';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login_callback',
    component: LoginComponent
  },
  {
    path: 'search',
    canActivate: [AuthenticatedGuard],
    component: SearchComponent
  },
  {
    path: 'users',
    canActivate: [AuthenticatedGuard],
    component: UsersComponent
  },
  {
    path: 'user/:loyaltyId',
    canActivate: [AuthenticatedGuard, LoadUserDetailGuard],
    canDeactivate: [SaveEditUserGuard],
    component: UserDetailComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routableComponents = [
  LoginComponent,
  SearchComponent,
  UsersComponent,
  UserDetailComponent
];
