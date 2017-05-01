import { Component, OnInit } from '@angular/core';
import { SlotService } from '../slot.service';
import { Observable } from 'rxjs/Observable';

import { Slot, SlotWithRSVP } from '../types';

@Component({
  selector: 'app-lunch',
  templateUrl: './lunch.component.html',
  styleUrls: ['./lunch.component.scss']
})
export class LunchComponent implements OnInit {
  slotList$: Observable<SlotWithRSVP[]>;

  constructor(slotService: SlotService) {
    this.slotList$ = slotService.fullSlotListWithChecked$;

  }

  ngOnInit() {
  }

}
