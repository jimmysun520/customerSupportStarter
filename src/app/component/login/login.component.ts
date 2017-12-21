import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdalService } from 'ng2-adal/dist/core';
import { environment } from '../../../environments/environment';
import Constants from '../../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message: string;

  constructor(private router: Router, private adalService: AdalService) {
    const config = {
      tenant: Constants.adfsDomain,
      clientId: environment.clientId,
      redirectUri: window.location.origin + '/' + Constants.appRoute.loginCallback,
      postLogoutRedirectUri: window.location.origin + '/'
    };
    this.adalService.init(config);
  }

  ngOnInit() {
    this.adalService.handleWindowCallback();
    this.adalService.getUser();
    if (this.adalService.userInfo.isAuthenticated) {
      this.router.navigate([Constants.appRoute.search]);
    }
  }

  login() {
    this.adalService.login();
  }

  public get isLoggedIn() {
    return this.adalService.userInfo.isAuthenticated;
  }

}
