// Libraries
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpModule } from '@angular/http';
import {
  MaterialModule,
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdSnackBarModule,
  MdDialogModule,
  MdToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Route
import { AppRoutingModule, routableComponents } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
// Services
import { AdalService } from 'ng2-adal/dist/core';
import { UserDataService } from './service/user-data.service';
// Guards
import { SaveEditUserGuard } from './guard/save-edit-user.guard';
import { LoadUserDetailGuard } from './guard/load-user-detail.guard';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
// Pipes
import { InitCapsPipe } from './pipe/init-caps.pipe';
import { ReadablePhonePipe } from './pipe/readable-phone.pipe';
import { ShortZipPipe } from './pipe/short-zip.pipe';
// Other
import Constants from './app.constants';

@NgModule({
  declarations: [
    AppComponent,
    routableComponents,
    ConfirmationDialogComponent,
    InitCapsPipe,
    ReadablePhonePipe,
    ShortZipPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    CdkTableModule,
    MdToolbarModule
  ],
  exports: [
    MaterialModule,
    MdToolbarModule
  ],
  providers: [UserDataService, SaveEditUserGuard, LoadUserDetailGuard, AuthenticatedGuard, AdalService],
  bootstrap: [AppComponent, ConfirmationDialogComponent]
})
export class AppModule { }
