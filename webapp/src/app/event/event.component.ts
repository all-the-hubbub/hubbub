import * as moment from 'moment';
import { Component, Input, OnInit } from '@angular/core';
import { Slot } from '../types';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() public startAt: Date;
  @Input() public name: String;
  @Input() public location: String;

  constructor() { }

  ngOnInit() {
  }

  get displayTime():string {
    let startTime = Number(this.startAt)*1000;
    return moment(startTime).format("h:mm A");
  }

  get day():string {
    let startTime = Number(this.startAt)*1000;
    return moment(startTime).format("DD");
  }

  get month():string {
    let startTime = Number(this.startAt)*1000;
    return moment(startTime).format("MMM");
  }

}
