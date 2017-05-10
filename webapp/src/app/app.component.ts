import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { MdDialog } from '@angular/material';
import { LunchComponent } from './lunch/lunch.component';

import { UserService } from './user.service'
import { Profile } from './types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'All the Hubbub';

  constructor(public userService: UserService, private readonly dialog: MdDialog) {
  }
  openDialog() {
    this.dialog.open(LunchComponent);
  }

}


