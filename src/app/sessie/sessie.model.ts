import { Oefening } from '../oefening/oefening.model';

export class Sessie {
 
  naam: string;
  beschrijving: string;
  oefeningen : Array<Oefening> = [];
  id: number;
  sessieCode: string;

  constructor(id: number, naam: string, beschrijving: string, sessieCode?: string, oefeningen?: Array<Oefening>) {
    this.id = id;
    this.naam = naam;
    this.beschrijving = beschrijving;
    if(oefeningen != undefined && oefeningen.length > 0 ) {
      //console.log(oefeningen)
      this.oefeningen = oefeningen;
    }
    if(sessieCode != undefined) {
      this.sessieCode = sessieCode;
    } 
  } 

  /**
   * voegt een oefening toe aan deze sessie
   * @param oefening Dit is een oefening die wordt toegevoegd aan de sessie
   */
  addOefening(oefening: Oefening) {
    this.oefeningen.push(oefening);
  }

  
  toJson() {
    return {
      naam: this.naam,
      beschrijving: this.beschrijving,
      oefeningen: this.oefeningen.map(oef => oef.toJSON()),
      id: this.id,
      sessieCode: this.sessieCode
    };
  }
}
