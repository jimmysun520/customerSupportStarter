import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { SearchComponent } from './search.component';
import { UserDataService } from '../../service/user-data.service';
import { UserDataServiceMock } from '../../service/user-data.service.mock';
import { Router } from '@angular/router';

class RouterStub {
  navigate(arr: Array<any>) { }
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: UserDataService, useClass: UserDataServiceMock },
        { provide: Router, userClass: RouterStub }
      ],
      declarations: [SearchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide no search button when no authId is provided by service', () => {
    expect(component.isOprable()).not.toBeTruthy();
    const de = fixture.debugElement.queryAll(By.css('.search'));
    expect(de.length).toBe(0);
  });

  it('should show "service unavailable" error on failed connection to API', () => {
    const userDataServiceStub = TestBed.get(UserDataService);
    userDataServiceStub.getAuthTokenFailed();
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('#noService'));
    const el = de.nativeElement;
    expect(el.textContent).toContain('unavailable');
  });

  it('should show search buttons when authId is provided', () => {
    const userDataServiceStub = TestBed.get(UserDataService);
    userDataServiceStub.getAuthToken().then(() => {
      fixture = TestBed.createComponent(SearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isOprable()).toBeTruthy();
      const de2 = fixture.debugElement.queryAll(By.css('.search'));
      expect(de2.length).toBe(2);
    });
  });
});
