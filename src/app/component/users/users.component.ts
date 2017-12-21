import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MdPaginator, MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserDataService } from '../../service/user-data.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../class/user';
import Constants from '../../app.constants';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit {
  displayedColumns = ['actions',
    'loyaltyId',
    'name',
    'phoneNumber', 'email',
    'city', 'state', 'zipCode',
  ];
  dataSource: UsersDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: ElementRef;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private userDataService: UserDataService,
    private snackBar: MdSnackBar,
  ) {
    this.userDataService.onAPIRequestError.subscribe(err => this.snackBar.open(err, 'Dismiss'));
  }

  ngOnInit() {
    this.dataSource = new UsersDataSource(this.userDataService, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    this.filter.nativeElement.focus();
  }

  edit(user: User): void {
    const link = [Constants.appRoute.userDetail, user.loyaltyId];
    this.router.navigate(link);
  }

  usersExist(): boolean {
    if (this.userDataService.data.length > 0) {
      return true;
    }
    return false;
  }

  goToSearch() {
    this.userDataService.dataChange.next([]);
    this.router.navigate([Constants.appRoute.search]);
  }

}

export class UsersDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  filteredDataSize = 0;
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _userDataService: UserDataService, private _paginator: MdPaginator) {
    super();
  }

  connect(): Observable<User[]> {
    const displayDataChanges = [
      this._userDataService.dataChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._userDataService.data.slice().filter((item: User) => {
        const searchStr = (
          item.loyaltyId + item.phoneNumber + item.email + item.firstName + ' ' + item.lastName
           + item.city + item.state + item.zipCode
        ).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      this.filteredDataSize = data.length;
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() { }
}
