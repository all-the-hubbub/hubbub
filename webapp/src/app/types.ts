
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

