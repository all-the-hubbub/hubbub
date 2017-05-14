import { APP_BASE_HREF }                    from '@angular/common';
import { NO_ERRORS_SCHEMA }                 from '@angular/core';
import { HttpModule }                       from '@angular/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireDatabaseModule }        from 'angularfire2/database';
import { FlexLayoutModule }                 from '@angular/flex-layout';
import { MdButtonModule,
         MdCardModule, MdCheckboxModule,
         MdDialogModule,
         MdListModule, MdMenuModule,
         MdSidenavModule, MdToolbarModule } from '@angular/material';
import { Observable }                       from 'rxjs/Observable';

// app dependencies
import { AdminService }                     from './admin.service';
import { UserService }                      from '../user.service';
import { WrapperComponent }                 from '../wrapper/wrapper.component';
import { Slot }                             from '../types';

// testing imports
import { subjectUid, subjectProfileData, UserServiceMock } from '../user.service.mock';
import { AdminComponent }                   from './admin.component';

class MockAdminService {
  public slotList$: Observable<Slot[]>;
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        WrapperComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FlexLayoutModule,
        HttpModule,
        MdButtonModule,
        MdCheckboxModule,
        MdCardModule,
        MdDialogModule,
        MdListModule,
        MdMenuModule,
        MdSidenavModule,
        MdToolbarModule,
      ],
      providers: [
        { provide: AdminService, useClass: MockAdminService },
        { provide: UserService, useClass: UserServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
