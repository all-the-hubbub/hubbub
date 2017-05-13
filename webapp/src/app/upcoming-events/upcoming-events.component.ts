import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SlotService } from '../slot.service';
import { UpcomingEvent } from '../types';

@Component({
  selector: 'upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss']
})
export class UpcomingEventsComponent implements OnInit {
  eventList$: Observable<UpcomingEvent[]>;

  constructor(private slotService: SlotService) { }

  ngOnInit() {
      this.eventList$ = this.slotService.userSlotList$;
  }

}

