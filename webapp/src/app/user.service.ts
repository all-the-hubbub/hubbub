import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Profile } from './types';

// TODO: the following is temporary -- check with deast@
import * as firebase from 'firebase/app';

// these need to be strings, because we can't use enum in template
// see details: https://github.com/angular/angular/issues/2885
type AuthStatus = "Unknown"|"LoggedIn"|"LoggedOut";

@Injectable()
export class UserService {
  public loginStatus: AuthStatus = "Unknown";
  public profile$: FirebaseObjectObservable<Profile>;
  db: firebase.database.Database;

  constructor(private afAuth: AngularFireAuth, private afDB: AngularFireDatabase, private ngZone: NgZone) {
    this.db = this.afDB.app.database();
    this.afAuth.auth.onAuthStateChanged(user => {
      this.ngZone.run(() => {
        console.log('user', user);
        if (user) {
          this.loginStatus = "LoggedIn";
          firebase.auth().getRedirectResult().then(result => {
            console.log('result', result);
            if (result.user) {
              // Firebase performed a re-direct, let's grab the token
              const token = result['credential']['accessToken'];
              if (token) {
                this.db.ref(`account/${user.uid}`).set({
                  provider: 'github',
                  token: token,
                  email: user.email,
                  timestamp: firebase.database.ServerValue.TIMESTAMP   // just for our reference
                })
              }
            }
          })
          this.profile$ = afDB.object(`profile/${user.uid}`);
        } else {
          this.loginStatus = "LoggedOut";
        }
      })
    })
  }

  login() {
    const provider = new firebase.auth.GithubAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
  }
  logout() {
    this.loginStatus = "LoggedOut";
    this.afAuth.auth.signOut();
  }
}
