import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Slot } from '../types';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  slotList$: Observable<Slot[]>;
  selected: Slot;

  constructor(adminService: AdminService, private http: Http) {
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
	  let headers = new Headers({ 'Content-Type': 'application/json' });
    let endpoint = 'https://us-central1-hubbub-159904.cloudfunctions.net/closeSlot';
    return this.http.post(endpoint, {id: slot.$key}, { headers: headers })
      // Call map on the response observable to get the parsed people object
      //.map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(res => console.log('res', res));
	}

}
