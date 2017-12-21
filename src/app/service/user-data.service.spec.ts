import {
  TestBed,
  inject,
  fakeAsync
} from '@angular/core/testing';
import {
  Http,
  BaseRequestOptions,
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
} from '@angular/http';
import {
  MockConnection,
  MockBackend
} from '@angular/http/testing';

import { UserDataService } from './user-data.service';
import { User } from '../class/user';
import { USERS } from './mock-user';
import Constants from '../app.constants';

xdescribe('UserDataService', () => {
  const testServiceUrl = 'https://gatekeeper-mag-uat.fredsmeds-test.com/';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        UserDataService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  it('should post application/json and api-version 2 header to test service url and return mock_token', fakeAsync(
    inject([UserDataService, XHRBackend], (service: UserDataService, mockBackend: MockBackend) => {
      const mockResponse = {
        Result: {
          access_token: 'mock_token'
        }
      };
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.headers.get('content-type')).toEqual('application/json');
        expect(connection.request.headers.get('api-version').toString()).toEqual('2');

        expect(connection.request.url).toEqual(testServiceUrl + Constants.url.getAPIToken);
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
          status: 200
        })));
      });

      service.getAuthToken().then((result) => {
        expect(result).toBe('mock_token');
      });
    })
  ));

  // valid / invalid access_token
  // slow calls
  // errors
  // http not 200

  // it('should put search parameter to test service url search endpoint',
  //   inject([UserDataService, XHRBackend], (service, mockBackend) => {
  //     // const mockResponse = {
  //     //   Result: USERS
  //     // };
  //     // service.getAuthToken().then(() => service.search());


  //     mockBackend.connections.subscribe((connection: MockConnection) => {
  //       expect(connection.request.headers.get('content-type')).toEqual('application/json');
  //       expect(connection.request.headers.get('api-version').toString()).toEqual('2');
  //       expect(connection.request.headers.get('Authorization')).not.toEqual('Bearer ');
  //       expect(connection.request.headers.get('Authorization')).not.toEqual('');
  //       console.log(connection.request);
  //     });

  //     console.log('search');
  //     service.search().then((result) => {
  //       console.log('result');
  //       console.log(result);
  //       console.log('mockbackend');
  //       console.log(mockBackend.connections);
  //       // expect(result).toBe('mock_token');
  //     });

  //     console.log(mockBackend);
  //     console.log(mockBackend.connections);
  //   }));

  // it('should return a user by loyaltyId', inject([UserDataService], (service: UserDataService) => {
  //   // console.log(service.data);
  //   const loyaltyId = 200000430;
  //   service.getAuthToken().then(
  //     () => service.getUser(loyaltyId).then(
  //       (res) => {
  //         expect(res).toBeTruthy();
  //         console.log(res);
  //       })
  //   );
  // }));

  // }));
  // it('should return inmar token for a specific user which we sent', inject([UserDataService], (service: UserDataService) => {
  //   const loyaltyId = 2408390052;
  //   const user = service.getUser(loyaltyId);
  //   // service.getInmarToken(user.phoneNumber, user.password);
  //   expect(service.inmarToken).toBeDefined();
  // }));

  // it('should update user', inject([UserDataService], (service: UserDataService) => {
  //   console.log(service.data);
  //   const loyaltyId = 2408390052;
  //   //need get user by loyalty id
  //   const originalUser: User;
  //   //get get inmar token
  //   //then update user
  //   const updatedUser: User;
  //   expect(JSON.stringify(originalUser) !== JSON.stringify(updatedUser)).toBeTruthy();
  // }));

  // it('should update password', inject([UserDataService], (service: UserDataService) => {
  //   console.log(service.data);
  //   const loyaltyId = 2408390052;
  //   //need get user by loyalty id
  //   //get get inmar token
  //   //then update password
  //   expect(service.data).toBeDefined();
  // }));

  // getInmarToken('2933911797', 'Password');



  // const userjson = {
  //   'userName': 'HSatani601',
  //   'email': 'HSatani601@fredsinc.com',
  //   'firstName': 'Hasan601',
  //   'lastName': 'Satani601',
  //   'phoneNumber': '9216569601',
  //   'address1': 'GetWell update1',
  //   'address2': '',
  //   'city': 'Albany',
  //   'state': 'NY',
  //   'zipCode': '12206',
  //   'emailOption': 'none',
  //   'subscribeEmail': true,
  //   'subscribePhone': true,
  //   'loyaltyId': '100000044',
  //   'password': ''
  // };
  // const user = <User>JSON.parse(JSON.stringify(userjson));
  // console.log(user);

  // const inmarToken = this.getInmarToken('2818774480', 'Password');
  //           const userjson = {
  //             'userName': 'HSatani51',
  //             'email': 'HSatani51@fredsinc.com',
  //             'firstName': 'Hasan51',
  //             'lastName': 'Satan51',
  //             'phoneNumber': '3016003551',
  //             'address1': 'GetWell update1',
  //             'address2': '',
  //             'city': 'Albany',
  //             'state': 'NY',
  //             'zipCode': '12206',
  //             'emailOption': 'none',
  //             'subscribeEmail': true,
  //             'subscribePhone': true,
  //             'loyaltyId': '2818774480',
  //             'password': 'Password'
  //           };
});
