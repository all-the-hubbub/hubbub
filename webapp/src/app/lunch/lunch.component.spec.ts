import { NO_ERRORS_SCHEMA }                 from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdListModule } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Slot } from '../types';

import { LunchComponent } from './lunch.component';
import { SlotService } from '../slot.service';

class MockSlotService {
  public slotList$: Observable<Slot[]>;
}

describe('LunchComponent', () => {
  let component: LunchComponent;
  let fixture: ComponentFixture<LunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchComponent ],
      imports: [
        MdButtonModule, MdCardModule, MdCheckboxModule, MdListModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SlotService, useClass: MockSlotService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
