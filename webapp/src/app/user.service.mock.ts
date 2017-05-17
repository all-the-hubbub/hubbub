import { Observable } from 'rxjs/Observable';
import { Profile, Account }  from './types'
import { AuthStatus } from './user.service';


export const subjectUid = '1234';
export const subjectEmail = 'someone@whatever.com';
export const subjectProfileData = {
    photo: 'https://whatever.com/photo.jpg',
    email: subjectEmail,
    name: 'Maria Sanchez'
};

export const subjectAccountData = {
    email: subjectEmail,
    admin: false,
    githubToken: '1234abcd'
};


// Mock for loggedIn user
export class UserServiceMock {
  public loginStatus: AuthStatus = "LoggedIn";
  public profile$: Observable<Profile>;
  public user$: Observable<any>;
  public account$: Observable<Account | undefined>;

  constructor() {
    let user = {
      uid: subjectUid,
      email: subjectProfileData.email
    };
    this.user$ = Observable.create(function (observer) {
      observer.next(user);
    });
    this.profile$ = Observable.create(function (observer) {
      observer.next(subjectProfileData);
    });
    this.account$ = Observable.create(function (observer) {
      observer.next(subjectAccountData);
    });
  }

}
