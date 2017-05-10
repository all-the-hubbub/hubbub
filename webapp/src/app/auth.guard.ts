import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
      console.log('constructor LoggedIn');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('canActivate');
    return this.afAuth.authState
          .map(user => user != null)      // null means not authenticated
          .do(isAuthenticated => {   // change routes if not authenticated
            if(!isAuthenticated) {
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            }
          });
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('canActivateChild');
    return this.afAuth.authState
          .map(user => user != null)  // null means not authenticated
          .do(isAuthenticated => {    // change routes if not authenticated
            if(!isAuthenticated) {
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            }
          });
  }
}