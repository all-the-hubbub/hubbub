import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Slot } from '../types';

// TODO: the following is temporary -- check with deast@
import * as firebase from 'firebase/app';

@Injectable()
export class AdminService {
  public slotList$: FirebaseListObservable<Slot[]>;
  db: firebase.database.Database;

  constructor(private afDB: AngularFireDatabase) {
    this.db = this.afDB.app.database();
    this.slotList$ = afDB.list('slots');
  }

}
