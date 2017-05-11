import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import { Profile } from './types';

import * as firebase from 'firebase/app';

// these need to be strings, because we can't use enum in template
// see details: https://github.com/angular/angular/issues/2885
export type AuthStatus = "Unknown"|"LoggedIn"|"LoggedOut";

@Injectable()
export class UserService {
  public loginStatus: AuthStatus = "Unknown";
  public profile$: Observable<Profile | undefined>;
  public user$: Observable<firebase.User>;
  db: firebase.database.Database;

  constructor(private afAuth: AngularFireAuth, private afDB: AngularFireDatabase, private ngZone: NgZone) {
    console.log('UserService constructor');
    this.db = this.afDB.app.database();

    this.user$ = this.afAuth.authState;
    this.profile$ = this.afAuth.authState.do(user => {
        console.log('UserService: user', user);
        if (user) {
          this.loginStatus = "LoggedIn";
          this.afAuth.auth.getRedirectResult().then(result => {
            console.log('UserService: getRedirectResult', result);
            if (result.user) {
              // Firebase performed a re-direct, let's grab the token
              const token = result['credential']['accessToken'];
              if (token) {
                this.db.ref(`accounts/${user.uid}/githubToken`).set(token);
              }
            }
        })
        } else {
          this.loginStatus = "LoggedOut";
        }
    }).mergeMap(user => {
      if (user) {
        return afDB.object(`profiles/${user.uid}`);
      } else {
        return Observable.of(undefined);
      }
    })
  }

  getToken(forceRefresh: boolean = false) {
    return this.afAuth.auth.currentUser.getToken(forceRefresh);
  }
  login() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider);
  }
  logout() {
    this.loginStatus = "LoggedOut";
    this.afAuth.auth.signOut();
  }
}

