import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private userService: UserService,
              private router: Router) {
      console.log('constructor LoggedIn');
  }

  activationCheck(state):Observable<boolean>{
    return this.userService.user$.do(user => {
      if (user == null) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      }
      return user;
    }).map(user => {
        return (user != null);  // allow if authenticated
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('canActivate');
    return this.activationCheck(state)
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('canActivateChild');
    return this.activationCheck(state)
  }
}