import { NO_ERRORS_SCHEMA }                 from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  MdButtonModule,
          MdCardModule, MdCheckboxModule,
          MdDialogModule,
          MdListModule, MdMenuModule,
          MdSidenavModule,
          MdToolbarModule }                 from '@angular/material';
import { Observable }                       from 'rxjs/Observable';

// app dependencies
import { SlotService }                      from '../slot.service';
import { UserService }                      from '../user.service';
import { WrapperComponent }                 from '../wrapper/wrapper.component';
import { Slot }                             from '../types';

// testing imports
import { subjectUid, subjectProfileData, UserServiceMock } from '../user.service.mock';
import { UpcomingEventsComponent }          from './upcoming-events.component';


class MockSlotService {
  public slotList$: Observable<Slot[]>;
}

describe('UpcomingEventsComponent', () => {
  let component: UpcomingEventsComponent;
  let fixture: ComponentFixture<UpcomingEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UpcomingEventsComponent,
        WrapperComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MdButtonModule,
        MdCardModule,
        MdCheckboxModule,
        MdDialogModule,
        MdListModule,
        MdMenuModule,
        MdSidenavModule,
        MdToolbarModule,
      ],
      providers: [
        { provide: SlotService, useClass: MockSlotService },
        { provide: UserService, useClass: UserServiceMock },
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
