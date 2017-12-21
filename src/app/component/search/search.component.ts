/**
 * Search By Email, PhoneNumber, or even LoyaltyID.
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MdIcon, MdCard, MdRadioButton } from '@angular/material';
import { UserDataService } from '../../service/user-data.service';
import Constants from '../../app.constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchLoyaltyId: number;
  searchEmail: string;
  searchPhone: number;
  searchFirstname: string;
  searchLastname: string;
  searchCity: string;
  searchState: string;
  searchZip: string;
  searchSubscribeEmail: boolean | null = null;
  searchSubscribePhone: boolean | null = null;
  subscriptionKeys: any;
  subscriptionType: any;
  @Output() showResult: EventEmitter<boolean> = new EventEmitter();

  constructor(private userDataService: UserDataService, private router: Router) {
    this.subscriptionType = Constants.subscriptionType;
    this.subscriptionKeys = Object.keys(Constants.subscriptionType);
  }

  ngOnInit() {
  }

  isOprable(): boolean {
    return this.userDataService.authId !== undefined;
  }
  showServiceError(): boolean {
    return this.userDataService.noAuthToken === true;
  }

  // searchByPhone(phone: number): any {
  //   if (!this.isOprable) { return; }
  //   this.userDataService.getUserByPhone(phone.toString());
  //   this.router.navigate(['users']);
  // }

  // searchByEmail(email: string): any {
  //   if (!this.isOprable) { return; }
  //   this.userDataService.getUserByEmail(email);
  //   this.router.navigate(['users']);
  // }

  searchByLoyaltyId(loyaltyId: number): any {
    if (!this.isOprable) { return; }
    this.userDataService.getUserById(loyaltyId);
    this.router.navigate(['users']);
  }

  doSearch() {
    if (!this.isOprable) { return; }
    this.search(
      this.searchFirstname, this.searchLastname,
      this.searchPhone, this.searchEmail,
      this.searchCity, this.searchState, this.searchZip,
      this.searchSubscribeEmail, this.searchSubscribePhone
    );
    this.router.navigate(['users']);
  }

  search(
    searchFirstname, searchLastname,
    searchPhone, searchEmail,
    searchCity, searchState, searchZip,
    searchSubscribeEmail, searchSubscribePhone
  ) {

    this.userDataService.search(
      searchFirstname, searchLastname,
      searchPhone, searchEmail,
      searchCity, searchState, searchZip,
      searchSubscribeEmail, searchSubscribePhone
    );
  }

  clear() {
    this.searchEmail = '';
    this.searchPhone = undefined;
    this.searchLoyaltyId = undefined;
    this.searchFirstname = '';
    this.searchLastname = '';
  }

  goToUsers() {
    this.userDataService.getUsers();
    this.router.navigate([Constants.appRoute.userTable]);
  }

}
