export interface Roles {
    admin:  boolean;
  }

  export class Admin {
    email:    string;
    roles:    Roles;

    constructor(authData) {
      this.email    = authData.email;
      this.roles    = { admin: true };
    }
}
