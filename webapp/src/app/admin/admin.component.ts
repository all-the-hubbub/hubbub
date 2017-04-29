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

  constructor(adminService: AdminService) {
    this.slotList$ = adminService.slotList$;
  }

  ngOnInit() {
    console.log('AdminComponent loaded');
  }

}
