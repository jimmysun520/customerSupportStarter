import { Component } from '@angular/core';
import { AdalService } from 'ng2-adal/dist/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import Constants from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public adal: AdalService,
    public dialog: MdDialog,
    private router: Router
  ) { }

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.adal.logOut();
      }
    });
  }

  navigateToSearch() {
    this.router.navigate([Constants.url.search]);
  }
}
