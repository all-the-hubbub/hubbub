import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http, Response, Headers} from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';

import { Profile, Slot, SlotWithRSVP, UpcomingEvent } from './types';
import { UserService } from './user.service'
import { environment } from '../environments/environment';

// TODO: the following is temporary -- check with deast@
import * as firebase from 'firebase/app';


@Injectable()
export class SlotService {
  public fullSlotList$: FirebaseListObservable<Slot[]>;
  public userSlotList$: FirebaseListObservable<UpcomingEvent[] | null > ;
  public fullSlotListWithChecked$: Observable<SlotWithRSVP[]>;
  db: firebase.database.Database;
  private uid: string;    // userId // TODO: remove once we have auth with Cloud Functions

  constructor(private afDB: AngularFireDatabase,
              private userService: UserService,
              private http: Http) {
    this.db = this.afDB.app.database();
    this.fullSlotList$ = afDB.list('events');

    this.userSlotList$ = userService.profile$.switchMap(
      (currentProfile: any, index: number) => {
        console.log('currentProfile', currentProfile);
        if (currentProfile) {
          this.uid = currentProfile.$key;
          return afDB.list(`/accounts/${currentProfile.$key}/events`);
        } else {
          return FirebaseListObservable.of(null);
        }
    }) as FirebaseListObservable<Slot[] | null >;


    this.fullSlotListWithChecked$ = Observable.combineLatest(this.fullSlotList$, this.userSlotList$, (fullSlotList, userSlotList) => {
      if (!userSlotList) return null;
      return fullSlotList.map(value => {
        let combinedSlot =  {
          $key: value.$key,
          name: value.name,
          state: value.state,
          startAt: value.startAt,
          endAt: value.endAt,
          location: value.location,
          requested: userSlotList.map(e => e.$key).includes(value.$key)
        }
        return combinedSlot;
      })
    })

  }

  /*
   * post `body` to HTTP function with authentication
   */
  httpFunctionWithAuth(name, body) {
    console.log('http:', name, body);
    let token = this.userService.getToken().then(token => {
      let headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      let endpoint = `${environment.config.functionRoot}/${name}`;
      return this.http.post(endpoint, body, { headers: headers })
        .do(res => console.log('res', res));
    })

  }

  join(slot: Slot) {
    return this.httpFunctionWithAuth('joinEvent',
                              { id: slot.$key, userId: this.uid });
  }

  leave(slot: Slot) {
    return this.httpFunctionWithAuth('leaveEvent',
                              { id: slot.$key, userId: this.uid });
  }


}
