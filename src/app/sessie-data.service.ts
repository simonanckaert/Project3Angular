import { Injectable } from '@angular/core';
import { Sessie } from './sessie/sessie.model';
import * as globals from '../globals/globals';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
//import * as firebase from 'firebase';
import { List } from 'lodash';
import { Oefening } from './oefening/oefening.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Aankondiging } from './aankondiging/aankondiging';
import { Gebruiker } from './gebruikers/gebruiker.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Feedback } from './feedback/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class SessieDataService {

  gebruikers: Gebruiker[] = []

  constructor(private http: HttpClient, private afs: AngularFirestore,
     private firebaseStorage: AngularFireStorage, private firebaseAuth: AngularFireAuth) { 
    this.getGebruikers()
  }

  getSessies() {
    return this.afs.collection('sessies').valueChanges();
  }

  getAankondigingen() {
    return this.afs.collection('aankondigingen').valueChanges();
  }
  
  getGebruikers() {
    return this.afs.collection('Users').valueChanges()
  }

  getSessie(sessieId: number): Observable<Sessie> {
    const sessieRef : AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessieId}`);
    return sessieRef.valueChanges()
  }

  verwijderOefening(sessie: Sessie, oef : Oefening) {
    this.firebaseStorage.storage.refFromURL(oef.url).delete().catch(error => console.log('in catch'));
    this.uploadSessie(sessie);
    //hierbij komt er een foutmelding in console maar het werkt wel, het lijkt alsof hij het 2 keer probeert te verwijderen
  }

  verwijderSessie(sessieId: number) {
    const sessieRef: AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessieId}`);
    sessieRef.delete();
  }

  verwijderAankondiging(id: string) {
    const aankondigingRef: AngularFirestoreDocument<any> = this.afs.doc(`aankondigingen/${id}`);
    aankondigingRef.delete();
  }

  verwijderGebruiker(uid: string) {
    const gebruikersRef: AngularFirestoreDocument<any> = this.afs.doc(`Users/${uid}`);
    gebruikersRef.delete();
  }

  uploadSessie(sessie: Sessie) {
    const sessieRef: AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessie.id}`);
    const data = {
      naam: sessie.naam,
      beschrijving: sessie.beschrijving,
      oefeningen: sessie.oefeningen.map(oef => oef.toJSON()),
      id: sessie.id,
      sessieCode: sessie.sessieCode
    };
    return sessieRef.set(data, { merge: true });
  }

  uploadGebruiker(gebruiker) {
    const gebruikersRef: AngularFirestoreDocument<any> = this.afs.doc(`Users/${gebruiker.uid}`);
    const data = {
      email: gebruiker.email,
      groepnr: gebruiker.groep,
      name: gebruiker.name,
      uid: gebruiker.uid
    };
    return gebruikersRef.set(data, { merge: true });
  }

  voegNieuweAankondigingToe(aankondiging: Aankondiging) {
    const aankondigingRef: AngularFirestoreDocument<any> = this.afs.doc(`aankondigingen/${aankondiging.id}`)
    const data = aankondiging.toJson();
    return aankondigingRef.set(data, { merge: true});
  }

  /*verwijderOefening(oefening: Oefening): any {
    console.log("in verwijderen")
    const sessieRef: AngularFirestoreDocument<any> = this.afs.doc(`sessies/${oefening.sessieId}`);
    var sessie = sessieRef.get().toPromise().then(result => console.log(result));
    console.log(sessie);
  }*/

  /*verwijderSessie(sessie: Sessie) {
    const sessieRef: AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessie.id}`);
    sessieRef.delete();
  }*/

  getFeedbackFromOefening(oefening: Oefening) {
    return this.afs.collection("feedback").doc(oefening.sessieId.toString()).collection("oefeningen").doc(oefening.oefeningId.toString()).collection("feedback").valueChanges()
  }
}
