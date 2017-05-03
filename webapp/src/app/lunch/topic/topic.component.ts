import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { Topic } from '../../types';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() public slotId: string;
  @Input() public topicId: string;
  public topic$: Observable<Topic>;

  constructor(private route: ActivatedRoute,
              private afDB: AngularFireDatabase) {
  //  this.topic$ =  this.afDB.object(`/assignments/20170517-001/firebase-001`);
  }

  ngOnInit() {
   this.route.params.subscribe(params => {
      console.log('params', params);
       this.slotId = params['slotId'];
       this.topicId = params['topicId'];
      console.log('datapath:', `/assignments/${this.slotId}/${this.topicId}`)

       this.topic$ =  this.afDB.object(`/assignments/${this.slotId}/${this.topicId}`)
        .do(topic => console.log('topic', topic));
    });


  }

}
