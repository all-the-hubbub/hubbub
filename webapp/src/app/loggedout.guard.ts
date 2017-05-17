import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';


/**
 * guard for /login to redirect to /home if the user is already logged in
 */
@Injectable()
export class OnlyIfLoggedOut implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
      console.log('constructor LoggedIn');
  }

  activationCheck(state):Observable<boolean>{
    return this.userService.user$.do(user => {
      if (user) {
          this.router.navigate(['/home']);
      }
      return user;
    }).map(user => {
        return (user == null);  // only allow if NOT authenticated
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.activationCheck(state)
  }
}