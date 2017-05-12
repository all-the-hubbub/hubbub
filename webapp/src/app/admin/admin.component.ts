import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Slot } from '../types';
import { UserService } from '../user.service'
import { environment } from '../../environments/environment';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  slotList$: Observable<Slot[]>;
  selected: Slot;

  constructor(adminService: AdminService,
              private userService: UserService,
              private http: Http) {
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
    let token = this.userService.getToken().then(token => {
      let headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      let endpoint = `${environment.config.functionRoot}/closeEvent`;
      return this.http.post(endpoint, {id: slot.$key}, { headers: headers })
        .subscribe(res => console.log('res', res));
    });

	}

}
