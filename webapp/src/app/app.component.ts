import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { LunchComponent } from './lunch/lunch.component';
import { MdDialog } from '@angular/material';

import { UserService } from './user.service'
import { Profile } from './types'
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hubbub';
  loggedIn: boolean = false;

  constructor(public userService: UserService, private readonly dialog: MdDialog) {
  }
  openDialog() {
    this.dialog.open(LunchComponent);
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.loggedIn = (user != null);
    })
  }

}


