export class Aankondiging {

    constructor(public id: string, public tekst: string, public datum: Date, public groep: string) {
    }

    toJson() {
        return {
            id: this.id,
            tekst: this.tekst,
            datum: this.datum.getTime(),
            groep: this.groep
          }
    }
}