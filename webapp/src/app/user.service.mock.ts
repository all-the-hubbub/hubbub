import { Observable } from 'rxjs/Observable';
import { Profile }  from './types'
import { AuthStatus } from './user.service';


export const subjectUid = '1234';
export const subjectProfileData = {
    photo: 'https://whatever.com/photo.jpg',
    email: 'someone@whatever.com',
    name: 'Maria Sanchez'
};


export class UserServiceMock {
  public loginStatus: AuthStatus = "Unknown";
  public profile$: Observable<Profile>;
  public user$: Observable<any>;

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

  }

}
