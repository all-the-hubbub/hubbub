import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { LunchComponent } from '../lunch/lunch.component';
import { MdDialog } from '@angular/material';

import { UserService } from '../user.service'
import { Profile } from '../types'
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})

/** Wrapper for app when the user is logged in
 *  and we want to show the toolbar
 */
export class WrapperComponent implements OnInit {
  title = 'Hubbub';
  loggedIn: boolean = false;
  admin = false;  // start out false, change to true if admin after login

  constructor(public userService: UserService, private readonly dialog: MdDialog) {
  }
  openDialog() {
    this.dialog.open(LunchComponent);
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.loggedIn = (user != null);
    })
    this.userService.account$.subscribe(account => {
      this.admin = account && account.admin;
    })

  }

}


