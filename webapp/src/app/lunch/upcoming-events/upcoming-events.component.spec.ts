import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdListModule } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { UpcomingEventsComponent } from './upcoming-events.component';
import { SlotService } from '../../slot.service';
import { Slot } from '../../types';

class MockSlotService {
  public slotList$: Observable<Slot[]>;
}

describe('UpcomingEventsComponent', () => {
  let component: UpcomingEventsComponent;
  let fixture: ComponentFixture<UpcomingEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingEventsComponent ],
      imports: [
        MdButtonModule, MdCardModule, MdCheckboxModule, MdListModule,
      ],
      providers: [
        { provide: SlotService, useClass: MockSlotService },
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
