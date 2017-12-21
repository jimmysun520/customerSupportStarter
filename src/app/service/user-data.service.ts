import { Injectable, Output, EventEmitter } from '@angular/core';
import { User } from '../class/user';
// import { USERS } from './mock-user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import Constants from '../app.constants';

import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class UserDataService {
  noAuthToken: boolean|null = null;
  private default_header = new Headers({
    'Content-Type': 'application/json',
    'api-version': 2.0
  });

  public onAPIRequestError: EventEmitter<string>;

  // api token
  authId: string;
  authLoop = false;
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] { return this.dataChange.value; }

  constructor(private http: Http) {
    this.onAPIRequestError = new EventEmitter<string>();
    this.getAuthToken();
    // this.connect();
  }

  // connect(): Promise<any> {
  //   return this.getAuthToken().then(
  //     response => {
  //       // if (200 === response.status) {
  //       //   this.authId = response.json().Result.access_token;
  //       //   this.addAuthIdToHeader();
  //       //   return this.authId;
  //       // }
  //       // else{
  //       //   console.error("Can not get auth token");
  //       //   console.error(response);
  //       //   return Promise.reject(response);
  //       // }
  //       return response;
  //     }
  //   );
  // }

  addAuthIdToHeader() {
    const bear = 'Bearer ' + this.authId;
    this.default_header.set('Authorization', bear);
  }

  /**
   * use client_id and client_secret to do POST request, unwrap access_token from API server
   */
  getAuthToken(): Promise<any> {
    const header: Headers = this.default_header;
    const body = {
      'client_id': environment.clientId,
      'client_secret': environment.clientSecret,
    };
    const result = this.http.post(
      environment.base_url + Constants.url.getAPIToken,
      JSON.stringify(body),
      { headers: header }
    )
      .toPromise()
      .then(response => {
        if (200 === response.status) {
          this.authId = response.json().Result.access_token;
          this.addAuthIdToHeader();
          this.noAuthToken = false;
          return this.authId;
        }
      })
      .catch(error => {
        this.onAPIRequestError.emit(error.statusText);
        this.noAuthToken = true;
        return Promise.reject(error.statusText);
      });
    return result;
  }

  /**
   * Handle auth error. Should try reconnection by n*2, n >= 8 seconds.
   * @param error
   */
  private handleAuthError(error: any): Promise<any> {
    console.error('An auth error occurred', error);
    return Promise.reject(error.message || error);
  }

  /**
   * get all users. Will redo get API token when needed.
   */
  getUsers(): any {
    if (!this.authId) { // invalid authId
      if (this.authLoop) {
        console.error('Gatekeeper service can not be reached!');
        return;
      }

      this.authLoop = true;
      const authId: Promise<string> = this.getAuthToken();
      return authId.then(response => {
        return this.getUsers();
        // return this.getUsers();
      });
    } else {
      const result = this.http.get(
        environment.base_url + Constants.url.getCouponUsers,
        { headers: this.default_header }
      )
        .toPromise()
        .then(
        response => {
          if (200 === response.status) {
            this.dataChange.next(<User[]>response.json().Result.reverse());
          }
          if (response.status === 401) { // token expired
            const authId: Promise<string> = this.getAuthToken();
            return authId.then(res => {
              return this.getUsers(); // redo getUser with new API Token
            });
          }
        }
        )
        .catch(error => {
          this.onAPIRequestError.emit(error.statusText);
          return Promise.reject(error.statusText);
        });
    }
  }

  /**
   * Get a user from this.data; No server calls.
   * @param loyaltyId
   */
  getUser(loyaltyId: number): any {
    const loyaltyStr = String(loyaltyId);
    if (this.data.length) {
      return this.data.filter(userData => {
        if (userData.loyaltyId === loyaltyStr) {
        }
        return userData.loyaltyId === loyaltyStr;
      });
    } else {
      if (!this.authId) { // invalid authId
        // return this.getAuthToken().then(token => {
        //   return this.getUsers().then(res => this.getUser(loyaltyId));
        // });
      } else {
        //   const result = this.http.get(environment.base_url + Constants.url.getCouponUserByLoyaltyId
        //     + loyaltyStr + '/loyaltyid', { headers: this.default_header })
        //     .toPromise()
        //     .then(
        //     response => {
        //       if (200 === response.status) {
        //         this.dataChange.next(<User[]>response.json().Result);
        //         return <User>response.json().Result;
        //       }
        //       else if (response.status === 401) { // token expired
        //         return this.getAuthToken().then(token => {
        //           return this.getUser(loyaltyId);
        //         })
        //       }else if (response.status === 404){
        //         alert(response.json().Result.ErrorMessage + " loyaltyID: " + loyaltyId);
        //       }
        //     }
        //     )
        //     .catch(this.handleError);
        // }
      }
    }
  }

  updateUser(user: User, token: string): Promise<any> {
    const url = environment.base_url + Constants.url.updateUser;
    // @TODO: refactor
    const body = this.buildUserForUpdate(user, token);
    const result = this.http.put(url, JSON.stringify(body), { headers: this.default_header })
      .toPromise()
      .then(res => this.updateBehaviorSubject(res))
      .catch(error => {
        this.onAPIRequestError.emit(error.statusText);
        return Promise.reject(error.statusText);
      });
    return result;
  }

  /**
   * As The format of user is specified by GateKeeper, this should be a config.
   * @param user
   * @param inmarUserToken
   */
  private buildUserForUpdate(user: User, inmarUserToken: string): any {
    const body = {
      'UserName': <String>user.phoneNumber,
      'Email': <String>user.email,
      'FirstName': <String>user.firstName,
      'LastName': <String>user.lastName,
      'PhoneNumber': <String>user.phoneNumber,
      'Address1': <String>user.address1,
      'Address2': <String>user.address2,
      'City': <String>user.city,
      'State': <String>user.state,
      'ZipCode': <String>user.zipCode,
      'EmailOption': 'none',
      'SubscribeEmail': <boolean>user.subscribeEmail,
      'SubscribePhone': <boolean>user.subscribePhone,
      'LoyaltyId': <String>user.loyaltyId,
      'MyInmarToken': <String>inmarUserToken,
    };

    return body;
  }

  private updateBehaviorSubject(res: Response): Promise<any> {
    const newUser = res.json().Result;
    const oldUsers = [];
    this.data.forEach(aUser => {
      if (aUser.loyaltyId === newUser.loyaltyId) {
        oldUsers.push(newUser);
      } else {
        oldUsers.push(aUser);
      }
    });
    this.dataChange.next(oldUsers);
    return res.json().Result;
  }

  updatePassword(user: User, newPass: string, token: string): Promise<any> {
    const body = {
      'loyaltyId': user.loyaltyId,
      'CurrentPassword': user.password,
      'newPassword': newPass,
      'MyInmarToken': token,
    };
    const result =
      this.http.put(
        environment.base_url + Constants.url.updatePassword,
        JSON.stringify(body),
        { headers: this.default_header }
      )
        .toPromise()
        .then(response => {
          if (200 === response.status) {
            this.authId = response.json();
          }
        })
        .catch(error => {
          this.onAPIRequestError.emit(error.statusText);
          return Promise.reject(error.statusText);
        });
    return result;
  }

  private handleError(error: any): Promise<string> {
    console.error('An error occurred', error);
    console.log('error handle');
    // console.log(this); // undefined!!!
    // this.onAPIRequestError.emit(error.statusText);  // error
    return Promise.reject(error.statusText);
  }

  getInmarToken(phoneAsUserName: string, pass: string): Promise<string> {
    const url = environment.base_url + Constants.url.inmarToken;
    const body = {
      'username': phoneAsUserName,
      'password': pass,
    };
    const result = this.http.post(url, JSON.stringify(body), { headers: this.default_header })
      .toPromise()
      .then(response => response && response.status <= 300 ? response.json().Result.token : '')
      .catch(error => {
        this.onAPIRequestError.emit(error.statusText);
        return Promise.reject(error.statusText);
      });
    return result;
  }

  // getUserByEmail(email: String): any {
  //   const url = environment.base_url + Constants.url.getCouponUserByEmail + '/' + email;
  //   if (!this.authId) { // invalid authId
  //     if (this.authLoop) {
  //       console.error('Gatekeeper service can not be reached!');
  //       return;
  //     }

  //     this.authLoop = true;
  //     const authId: Promise<string> = this.getAuthToken();
  //     return authId.then(response => {
  //       return this.getUserByEmail(email);
  //     });
  //   } else {
  //     const result = this.http.get(url, { headers: this.default_header })
  //       .toPromise()
  //       .then(
  //       response => {
  //         if (200 === response.status) {
  //           this.dataChange.next(<User[]>[response.json().Result]);
  //         }
  //         if (response.status === 401) { // token expired
  //           const authId: Promise<string> = this.getAuthToken();
  //           return authId.then(res => {
  //             return this.getUserByEmail(email); // redo getUser with new API Token
  //           });
  //         }
  //       }
  //       )
  //       .catch(error => {
  //         this.onAPIRequestError.emit(error.statusText);
  //         return Promise.reject(error.statusText);
  //       });
  //     return result;
  //   }
  // }

  // getUserByPhone(phoneNum: string): Promise<any> {
  //   const url = environment.base_url + Constants.url.getCouponUserByPhone + '/' + phoneNum;
  //   if (!this.authId) { // invalid authId
  //     if (this.authLoop) {
  //       console.error('Gatekeeper service can not be reached!');
  //       return;
  //     }

  //     this.authLoop = true;
  //     const authId: Promise<string> = this.getAuthToken();
  //     return authId.then(response => {
  //       return this.getUserByPhone(phoneNum);
  //     });
  //   } else {
  //     const result = this.http.get(url, { headers: this.default_header })
  //       .toPromise()
  //       .then(
  //       response => {
  //         if (200 === response.status) {
  //           this.dataChange.next(<User[]>[response.json().Result]);
  //         }
  //         if (response.status === 401) { // token expired
  //           const authId: Promise<string> = this.getAuthToken();
  //           return authId.then(res => {
  //             return this.getUserByPhone(phoneNum); // redo getUser with new API Token
  //           });
  //         }
  //       }
  //       )
  //       .catch(error => {
  //         this.onAPIRequestError.emit(error.statusText);
  //         return Promise.reject(error.statusText);
  //         // this.handleError(error); // The fun part is that: "this" will not work in handleError
  //       });
  //     return result;
  //   }
  // }

  getUserById(id: number): any {
    const url = environment.base_url + Constants.url.getCouponUserByIdPrefix + '/' + id.toString() + Constants.url.getCouponUserByIdSurfix;
    if (!this.authId) { // invalid authId
      if (this.authLoop) {
        console.error('Gatekeeper service can not be reached!');
        return;
      }

      this.authLoop = true;
      const authId: Promise<string> = this.getAuthToken();
      return authId.then(response => {
        return this.getUserById(id);
      });
    } else {
      const result = this.http.get(url, { headers: this.default_header })
        .toPromise()
        .then(
        response => {
          if (200 === response.status) {
            this.dataChange.next(<User[]>[response.json().Result]);
          }
          if (response.status === 401) { // token expired
            const authId: Promise<string> = this.getAuthToken();
            return authId.then(res => {
              return this.getUserById(id); // redo getUser with new API Token
            });
          }
        }
        )
        .catch(error => {
          this.onAPIRequestError.emit(error.statusText);
          return Promise.reject(error.statusText);
        });
      return result;
    }
  }

  search(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    city: string,
    state: string,
    zip: string,
    subscribeEmail: boolean,
    subscribePhone: boolean
  ): any {

    if (!this.authId) { // invalid authId
      if (this.authLoop) {
        console.error('Gatekeeper service can not be reached!');
        return;
      }

      this.authLoop = true;
      const authId: Promise<string> = this.getAuthToken();
      return authId.then(response => {
        return this.search(
          firstName, lastName,
          phone, email,
          city, state, zip,
          subscribeEmail, subscribePhone);
      });
    } else {
      const params = {
        'LastName': lastName,
        'FirstName': firstName,
        'PhoneNumber': phone,
        'Email': email,
        'City': city,
        'State': state,
        'ZipCode': zip,
        'SubscribeEmail': subscribeEmail,
        'SubscribePhone': subscribePhone
      };
      const result = this.http.post(
        environment.base_url + Constants.url.search,
        JSON.stringify(params),
        { headers: this.default_header }
      )
        .toPromise()
        .then(
        response => {
          if (200 === response.status) {
            this.dataChange.next(<User[]>response.json().Result.reverse());
          }
          if (response.status === 401) { // token expired
            const authId: Promise<string> = this.getAuthToken();
            return authId.then(res => {
              return this.search(
                firstName, lastName,
                phone, email,
                city, state, zip,
                subscribeEmail, subscribePhone
              ); // redo getUser with new API Token
            });
          }
        }
        )
        .catch(error => {
          this.onAPIRequestError.emit(error.statusText);
          return Promise.reject(error.statusText);
        });
    }
  }
}
