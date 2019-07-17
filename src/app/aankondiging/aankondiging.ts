export class Aankondiging {

    constructor(public id: string, public title: string, public start: Date, public groep: string) {
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            start: this.start.getTime(),
            groep: this.groep
          }
    }
}