import { Injectable } from '@angular/core';
import { Oefening } from './oefening/oefening.model';
import { HttpClient } from '@angular/common/http';
import * as globals from '../globals/globals';
import { Observable } from 'rxjs/Observable';
import { Feedback } from './feedback/feedback.model';
import { SessieDataService } from './sessie-data.service';
import { Sessie } from './sessie/sessie.model';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Aankondiging } from './aankondiging/aankondiging';

@Injectable()
export class OefeningDataService {
  constructor(private http: HttpClient, private sessieService : SessieDataService, private afs: AngularFirestore) {}

  getOefeningen(): Observable<Oefening[]> {
    return this.http.get<Oefening[]>(globals.backendUrl + `/oefeningen`).pipe();
  }

  getOefeningenFromSessie(sessieId: number): Observable<Oefening[]> {
    return this.http
      .get<Oefening[]>(globals.backendUrl + `/oefeningen/` + sessieId)
      .pipe();
  }

  getOefening(oefeningId: number): Observable<Oefening> {
    return this.http
    .get<Oefening>(globals.backendUrl + `/oefeningen/oef/` + oefeningId)
    .pipe();
  }

  voegNieuweOefeningToe(sessie : Sessie) {
    /*const fd = new FormData();
    fd.append('naam', oefening.naam);
    fd.append('beschrijving', oefening.beschrijving);
    fd.append('sessieId', oefening.sessieId.toString());
    fd.append('groepen', oefening.groepen);
    fd.append('file', oefening.file);

    return this.http
      .post<Oefening>(globals.backendUrl + `/oefeningen`, fd)
      .pipe();*/
    //console.log(sessie);
    this.sessieService.uploadSessie(sessie);
  }

  verwijderOefening(oefening: Oefening) {
    //this.sessieService.verwijderOefening(oefening);
    console.log('in verwijderen oefening')
    const oefRef: AngularFirestoreDocument<any> = this.afs.collection(`sessies/${oefening.sessieId}/oefeningen`).doc(`${oefening.oefeningId}`)/*.doc(`sessies/${oefening.sessieId}/oefeningen/`);*/
    console.log(oefRef);
    oefRef.delete();
    //oefRef.delete().then(() => console.log('tis gelukt')).catch(() => console.log('this niet gelukt'));
    /*return this.http
      .delete(globals.backendUrl + '/oefeningen/' + oefening.oefeningId)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );*/    
  }

  updateOefening(oefening: Oefening) {
    return this.http
      .put(globals.backendUrl + '/oefeningen/', oefening)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

  getFeedbackFromOefening(oefeningId: number): Observable<Feedback[]> {
    return this.http
    .get<Feedback[]>(globals.backendUrl + `/oefeningen/oef/` + oefeningId + '/feedback')
    .pipe();
  }

  verwijderFeedbackOefening(oefeningId: number) {
    return this.http
      .delete(globals.backendUrl + '/oefeningen/oef/' + oefeningId + '/feedback')
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }
}
