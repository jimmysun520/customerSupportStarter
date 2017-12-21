import { Injectable } from '@angular/core';

export const VALID_API_TOKEN = 'a-Fake-API-Token';

@Injectable()
export class UserDataServiceMock {
  authId: string;
  authLoop: false;
  dataChange: any;
  noAuthToken: boolean|null = null;

  getAuthToken(): Promise<string> {
    this.noAuthToken = false;
    return new Promise<string>(resolve => {
      this.authId = 'a fake auth token';
      resolve('a fake auth token');
    });
  }
  getAuthTokenFailed(): Promise<any> {
      this.noAuthToken = true;
      return new Promise<any>(resolve => resolve());
  }

  getUsers() { }
  getUser() { }

  getInmarToken() {
    return;
  }

  updatePasword() { }
  getUserById() { }
  search() { }
}
