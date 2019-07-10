export class Oefening {
    oefeningId: number;
    sessieId: number;
    naam: string;
    beschrijving: string;
    file: File;
    fileName: string;
    fileMimetype: string;
    fileOriginalName: string;
    fileSize: number;
    groepen: string;
    url: string;

    constructor(naam: string, beschrijving: string, sessieId: number) {
      this.naam = naam;
      this.beschrijving = beschrijving;
      this.sessieId = sessieId;
    }

    static fromJSON(json: any): Oefening {
      const oefening = new Oefening(
        json.naam, json.beschrijving, json.sessieId
      );
      oefening.fileMimetype = json.fileMimetype
      oefening.fileName = json.fileName
      oefening.fileOriginalName = json.fileOriginalName
      oefening.fileSize = json.fileSize
      oefening.groepen = json.groepen
      oefening.url = json.url
      return oefening;
    }

    toJSON() {
      return {
        //oefeningId: this.oefeningId,
        naam: this.naam,
        beschrijving: this.beschrijving,
        sessieId: this.sessieId,
        fileMimetype: this.fileMimetype,
        fileName: this.fileName,
        fileOriginalName: this.fileOriginalName,
        fileSize: this.fileSize,
        groepen: this.groepen,
        url: this.url
      };
    }
  }
