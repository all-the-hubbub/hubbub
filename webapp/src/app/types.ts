import * as moment from 'moment';

// Admins create "slots" for lunches
// when they are open, people can sign up
// closing them triggers the matching algorithm via Cloud Function
export class Slot {
  $key: string;
  name: string;
  location: string;
  state: "open" | "closed";
  startAt: Date;
  endAt: Date;

  get displayTime(): string {
    return moment(this.startAt).format("h:mm A");
  }

  get day():string {
    return moment(this.startAt).format("DD");
  }

  get month():string {
    return moment(this.startAt).format("MMM");
  }
}

export class SlotWithRSVP extends Slot {
  requested: boolean;
}

export class Topic {
  name: string;
  id: string;
}

export class UpcomingEvent extends Slot {
  topic: Topic;
}

// User's public profile
export type ProfileData = {
  $key?: string,
  photo?: string,
  handle?: string,
  name?: string
}

export class Profile {
    $key: string;
    photo: string;
    handle: string;
    name: string;
    constructor(data: ProfileData) {
      this.$key = data.$key || "";
      this.photo = data.photo || "";
      this.handle = data.handle || "";
      this.name = data.name || "";
    }
}

export class Account {
    $key: string;
    email: string;
    admin: boolean;
    githubToken: string;
    updatedAt: Object;    // server timestamp
}


