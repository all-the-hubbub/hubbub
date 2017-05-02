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
      authState: Observable.create(function (observer) {
                    observer.next(user);
                  }),
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
  let uid: '111';
  let profile = new Profile({
    photo: 'https://whatever.com/photo.jpg',
    handle: '@whatever',
    name: 'Maria Sanchez'
  });
  let email = 'someone@whatever.com';

  beforeEach(() => {
    service = new UserService(
      mockAFAuth({uid: uid, email: email}),
      mockAFDatabase(profile),
      new NgZone({}));
  });

  it('should have a profile', () => {
    service.profile$.subscribe(val => {
      expect(val.$key).toEqual(uid);
      expect(val.name).toEqual(profile.name);
      expect(val.handle).toEqual(profile.handle);
      expect(val.photo).toEqual(profile.photo);
    })
  });
});
