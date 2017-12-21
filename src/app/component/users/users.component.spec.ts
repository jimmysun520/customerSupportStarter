import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@angular/material';
import { UsersComponent } from './users.component';
import { InitCapsPipe } from '../../pipe/init-caps.pipe';
import { ReadablePhonePipe } from '../../pipe/readable-phone.pipe';
import { ShortZipPipe } from '../../pipe/short-zip.pipe';

xdescribe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      providers: [],
      declarations: [UsersComponent, InitCapsPipe, ReadablePhonePipe, ShortZipPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a table with data, filter, and pagination', () => {
    expect(component).toBeTruthy();

    // table is present
    // filter input is present
    // paginator input is present


    // display_column var are present

    // onInit, create dataSource

    // edit butons are present
    // clicking edit will route to /user/:loyaltyId

  });
});
