import { Component, OnInit }  from '@angular/core';
import { MdDialog }           from '@angular/material';
import { Observable }         from 'rxjs/Observable';

import { LunchComponent }     from '../lunch/lunch.component';
import { SlotService }        from '../slot.service';
import { UpcomingEvent }      from '../types';

@Component({
  selector: 'upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss']
})
export class UpcomingEventsComponent implements OnInit {
  eventList$: Observable<UpcomingEvent[]>;

  constructor(private slotService: SlotService, private readonly dialog: MdDialog) { }

  ngOnInit() {
      this.eventList$ = this.slotService.userSlotList$;
  }

  openDialog() {
    this.dialog.open(LunchComponent);
  }

}

