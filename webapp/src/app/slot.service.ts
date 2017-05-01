import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http, Response, Headers} from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';

import { Profile, Slot, SlotWithRSVP } from './types';

// TODO: the following is temporary -- check with deast@
import * as firebase from 'firebase/app';

import { UserService } from './user.service'

@Injectable()
export class SlotService {
  public fullSlotList$: FirebaseListObservable<Slot[]>;
  public userSlotList$: FirebaseListObservable<Slot[] | null > ;
  public fullSlotListWithChecked$: Observable<SlotWithRSVP[]>;
  db: firebase.database.Database;

  constructor(private afDB: AngularFireDatabase,
              private userService: UserService,
              private http: Http) {
    this.db = this.afDB.app.database();
    this.fullSlotList$ = afDB.list('slots');

    this.userSlotList$ = userService.profile$.switchMap(
      (currentProfile: any, index: number) => {
        console.log('currentProfile', currentProfile);
        if (currentProfile) {
          return afDB.list(`/accounts/${currentProfile.uid}/slots`);
        } else {
          return FirebaseListObservable.of(currentProfile);
        }
    }) as FirebaseListObservable<Slot[] | null >;

    this.fullSlotListWithChecked$ = Observable.combineLatest(this.fullSlotList$, this.userSlotList$, (fullSlotList, userSlotList) => {
      if (!userSlotList) return null;
      return fullSlotList.map(value => {
        let combinedSlot =  {
          id: value.id,
          name: value.name,
          state: value.state,
          startAt: value.startAt,
          endAt: value.endAt,
          requested: userSlotList.map(e => e.id).includes(value.id)
        }
        return combinedSlot;
      })
    })

  }

  // close(slot: Slot) {
  //   console.log('close item:', slot);
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let endpoint = 'https://us-central1-hubbub-159904.cloudfunctions.net/closeSlot';
  //   return this.http.post(endpoint, {id: slot.id}, { headers: headers })
  //     // Call map on the response observable to get the parsed people object
  //     //.map(res => res.json())
  //     // Subscribe to the observable to get the parsed people object and attach it to the
  //     // component
  //     .subscribe(res => console.log('res', res));
  // }

}
