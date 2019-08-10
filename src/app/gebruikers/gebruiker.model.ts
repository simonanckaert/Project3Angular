export class Gebruiker {
 
  uid: string;
  email: string;
  groep: number;
  naam: string;

  constructor(uid: string, email: string, groep: number, naam?: string) {
    this.uid = uid;
    this.email = email;
    this.groep = groep;
    if(naam != undefined) {
      this.naam = naam;
    } 
  }

  
  toJson() {
    return {
      uid: this.uid,
      email: this.email,
      groep: this.groep,
      naam: this.naam
    };
  }
}
