import { Injectable } from '@angular/core';

@Injectable()
export default class Constants {
  public static url = {
    'getAPIToken': 'apiclient/token',
    'getCouponUsers': 'couponuser',
    'getCouponUserByIdPrefix': 'couponuser',
    'getCouponUserByIdSurfix': '/loyaltyid',
    'inmarToken': 'couponuser/token',
    'getCouponUserByPhone': 'couponuser/phonenumber',
    'getCouponUserByLoyaltyId': 'couponuser/',
    'getCouponUserByEmail': 'couponuser/email',
    'updateUser': 'couponuser',
    'updatePassword': 'couponuser/password',
    'search': 'couponuser/search'
  };

  public static adfsDomain = 'fredsnet.onmicrosoft.com';

  public static defaultResetPassword = 'Password1';

  public static tooltips = {
    'getInmarTokenError':
    `Whenever user register an Inmar Digital Coupon Account, the account is expected to created in both Inmar\'s and our
     database. If this is marked as error, there is not such user in Inmar. Please
      use other tools to check with Inmar.`,
    'notEditable': 'You can not change this'
  };

  public static appRoute = { // This will not work if build with --prod flag
    'login': 'login',
    'loginCallback': 'login_callback',
    'search': 'search',
    'userTable': 'users',
    'userDetail': 'user'
  };

  public static subscriptionType = {
    'All' : null,
    'YES' : true,
    'NO' : false
  };
}
