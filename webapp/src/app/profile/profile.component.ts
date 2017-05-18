import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../types';
import { UserService } from '../user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: Profile | null = null;
  private loggedIn: boolean = false;
  public show = false;

  constructor(private userService: UserService) { }

  updateShow() {
    this.show = this.loggedIn && (this.profile != null);
  }
  ngOnInit() {
    // make sure we are logged in AND have profile data
    // before showing the profile
    this.userService.profile$.subscribe(new_profile => {
      if (new_profile) {
        this.profile = new_profile;
        this.updateShow();
      }
    })
    this.userService.user$.subscribe(user => {
      this.loggedIn = (user != null);
      this.updateShow();
    })
  }
}
