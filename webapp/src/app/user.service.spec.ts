import { NgZone } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';

import { Profile } from './types';
import { UserService } from './user.service';

type MockAuthData = {
  uid?: string,
  token?: string,
  email?: string,
}
let nextUserId = 1;
function mockAFAuth(options?: MockAuthData) {
    let uid, token, email = options;
    uid = uid || String(nextUserId++);
    token = token || "token" + uid;
    email = email || 'something@whatever.com';
    let user = {
      uid: uid,
      email: email
    };
    return {
      app: {} as any,
      auth:{
        onAuthStateChanged: function(callback) {
          callback(user);
        },
      getRedirectResult: function() {
        return Promise.resolve( {
          credential: {
            accessToken: token
          },
          user: user
        })
      }
      } as any
    } as AngularFireAuth;
}

function mockAFDatabase(object) {
  let object$ = Observable.create(function (observer) {
    observer.next(object);
  });

  return {
    object: jasmine.createSpy('ref').and.returnValue(object$) as any,
    app: {
      database: function() { return {
        ref: jasmine.createSpy('ref') as any,
      }}
    }
  } as AngularFireDatabase;
}

describe('UserService', () => {
  let service: UserService;
    let profile = new Profile({
      uid: '111',
      photo: 'https://whatever.com/photo.jpg',
      email: 'someone@whatever.com',
      name: 'Maria Sanchez'
    });

  beforeEach(() => {
    service = new UserService(
      mockAFAuth({uid: profile.uid, email: profile.email}),
      mockAFDatabase(profile),
      new NgZone({}));
  });

  it('should have a profile', () => {
    service.profile$.subscribe(val => {
      expect(val.uid).toEqual(profile.uid);
      expect(val.name).toEqual(profile.name);
      expect(val.email).toEqual(profile.email);
      expect(val.photo).toEqual(profile.photo);
    })
  });
});
