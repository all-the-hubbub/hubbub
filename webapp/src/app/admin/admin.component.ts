import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Observable } from 'rxjs/Observable';

import { Slot } from '../types';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  slotList$: Observable<Slot[]>;
  selected: Slot;

  constructor(adminService: AdminService) {
    this.slotList$ = adminService.slotList$;
  }

  ngOnInit() {
    console.log('AdminComponent loaded');
  }

  select(item: Slot) {
    console.log('selected item:', item);
    this.selected = item;
  }

  close(slot: Slot) {
    console.log('close item:', slot);
  }
}
