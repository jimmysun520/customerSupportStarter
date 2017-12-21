import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MdSnackBar, MdTooltipModule, MdDialog, MdDialogRef, MdCard, MdCardActions, MdCardContent } from '@angular/material';
import { User } from '../../class/user';
import 'rxjs/add/operator/switchMap';
import { UserDataService } from '../../service/user-data.service';
import { Location } from '@angular/common';
import Constants from '../../app.constants';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  private currentUser: User;
  private originalUser: User;
  token: string | undefined;
  defaultResetPassword: string;
  tooltips: any;
  resetConfirm: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userDataService: UserDataService,
    private location: Location,
    private snackBar: MdSnackBar,
    public dialog: MdDialog
  ) {
    this.token = undefined; // @TODO: refactor to user.ts
    this.defaultResetPassword = Constants.defaultResetPassword;
    this.tooltips = Constants.tooltips;
    this.resetConfirm = false;
  }

  get userData(): User {
    return this.currentUser;
  }

  set userData(userData: User) {
    userData = this.formatData(userData);
    this.originalUser = userData;
    this.currentUser = Object.assign({}, userData);

    this.retrieveInmarToken();
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.userDataService.getUser(+params.get('loyaltyId')))
      .subscribe(userData => this.userData = <User>userData);
  }

  get isDirty(): boolean {
    return JSON.stringify(this.originalUser) !== JSON.stringify(this.currentUser);
  }

  get existOnInmar(): boolean {
    return this.token !== undefined && this.token !== '';
  }

  retrieveInmarToken(): void { // @TODO: refactor to user.ts
    this.userDataService.getInmarToken(this.userData.phoneNumber, this.userData.password).then(token => {
      this.token = token;
    });
  }

  save() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        if (this.isDirty) {
          this.currentUser.userName = this.currentUser.phoneNumber;
          const updateRequest = this.userDataService.updateUser(this.currentUser, this.token);
          // wait for update success or failure before do anything else (provide message)
          updateRequest.then(user => {
            try {
            if (this.originalUser.userName !== this.currentUser.userName) {
              this.retrieveInmarToken();
            }
            this.originalUser = Object.assign({}, this.currentUser);
              // the returned user have no password field so do not use it
              this.snackBar.open('User updated!', 'Dismiss', { duration: 5000 });
            } catch (e) {
              this.snackBar.open('This user may not exist in Inmar system, update failed :( ', 'Dismiss', { duration: 5000 });
            }
          }).catch(error =>
            this.snackBar.open(error.statusText, 'Dismiss', { duration: 30000 })
            );
        }
      }
    });
  }

  cancel() {
    const link = [Constants.appRoute.search];
    this.router.navigate(link);
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        if (this.currentUser.password !== this.defaultResetPassword) {
          const resetRes = this.userDataService.updatePassword(this.currentUser, this.defaultResetPassword, this.token);
          resetRes.then(res => {
            try {
              this.currentUser.password = this.defaultResetPassword;
              this.originalUser.password = this.defaultResetPassword;
              this.snackBar.open('Password updated to "' + Constants.defaultResetPassword + '"!', 'Dismiss', { duration: 5000 });
            } catch (e) {
              this.snackBar.open('Update password failed :( ', 'Dismiss', { duration: 5000 });
            }
          }).catch(error =>
            this.snackBar.open(error.statusText, 'Dismiss', { duration: 30000 })
            );
        } else {
          this.snackBar.open('Password updated to "' + Constants.defaultResetPassword + '"!', 'Dismiss', { duration: 5000 });
        }
      }
    });
  }

  /**
   * Regulate inputs as what should it be.
   * @param user
   */
  formatData(user: User): User {
    user.state = (user.state !== null) ? user.state.toUpperCase() : '';
    return user;
  }
}
