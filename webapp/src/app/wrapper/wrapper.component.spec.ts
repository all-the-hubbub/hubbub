import { NO_ERRORS_SCHEMA }                 from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MdButtonModule, MdCheckboxModule,
         MdDialogModule, MdMenuModule,
         MdSidenavModule, MdToolbarModule } from '@angular/material';
import { Observable }                       from 'rxjs/Observable';

// app dependencies
import { UserService, AuthStatus }          from '../user.service';

// testing imports
import { subjectUid, subjectProfileData, UserServiceMock } from '../user.service.mock';
import { WrapperComponent }                 from './wrapper.component';

describe('WrapperComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WrapperComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
          { provide: UserService, useClass: UserServiceMock },
      ],
      imports: [
        MdButtonModule,
        MdCheckboxModule,
        MdDialogModule,
        MdMenuModule,
        MdSidenavModule,
        MdToolbarModule,
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

