
export type ProfileData = {
  uid: string,
  photo: string,
  email: string,
  name: string
}

export class Profile {
    uid: string;
    photo: string;
    email: string;
    name: string;
    constructor(data: ProfileData) {
      this.uid = data.uid;
      this.photo = data.photo;
      this.email = data.email;
      this.name = data.name;
    }
}

export class Account {
    uid: string;
    githubToken: string;
}

