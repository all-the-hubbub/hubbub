// Admins create "slots" for lunches
// when they are open, people can sign up
// closing them triggers the matching algorithm via Cloud Function
export class Slot {
  id: string;
  name: string;
  state: "open" | "closed";
  startAt: Date;
  endAt: Date;
}


// User's public profile
export type ProfileData = {
  uid: string,
  photo: string,
  handle: string,
  name: string
}

export class Profile {
    uid: string;
    photo: string;
    handle: string;
    name: string;
    constructor(data: ProfileData) {
      this.uid = data.uid;
      this.photo = data.photo;
      this.handle = data.handle;
      this.name = data.name;
    }
}

export class Account {
    uid: string;
    email: string;
    githubToken: string;
    updatedAt: Object;    // server timestamp
}


