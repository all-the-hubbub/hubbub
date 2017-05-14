import {APP_BASE_HREF}                      from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MdButtonModule, MdCheckboxModule,
         MdDialogModule, MdMenuModule,
         MdSidenavModule, MdToolbarModule } from '@angular/material';
import { RouterModule, Routes }             from '@angular/router';
import { Observable }                       from 'rxjs/Observable';

// app dependencies
import { UserService, AuthStatus }          from '../user.service';
import { AdminComponent }                   from '../admin/admin.component';
import { AppComponent }                     from '../app.component'
import { ProfileComponent }                 from '../profile/profile.component';
import { LoginComponent }                   from '../login/login.component';
import { LunchComponent }                   from '../lunch/lunch.component';
import { UpcomingEventsComponent }          from '../upcoming-events/upcoming-events.component';
import { Profile }                          from '../types'
import { routes }                           from '../app.router';

// testing imports
import { subjectUid, subjectProfileData, UserServiceMock } from '../user.service.mock';
import { WrapperComponent }                 from './wrapper.component';

describe('WrapperComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WrapperComponent, AdminComponent, ProfileComponent,
        LoginComponent, LunchComponent,
        // when I import 'routes' all components of all routes need to be declared
        // seems like I should be able to do this differently to isolate the
        // following dependencies
        AppComponent, UpcomingEventsComponent
      ],
      providers: [
          { provide: UserService, useClass: UserServiceMock },
          { provide: APP_BASE_HREF, useValue : '/' }

      ],
      imports: [
        MdButtonModule,
        MdCheckboxModule,
        MdDialogModule,
        MdMenuModule,
        MdSidenavModule,
        MdToolbarModule,
        RouterModule,
        routes
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(WrapperComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Hubbub'`, async(() => {
    const fixture = TestBed.createComponent(WrapperComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toContain('Hubbub');
  }));

  it('should render title', async(() => {
    const fixture = TestBed.createComponent(WrapperComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('Hubbub');
  }));
});

