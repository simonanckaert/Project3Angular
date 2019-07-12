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

@Injectable({
  providedIn: 'root'
})
export class SessieDataService {

  private _sessies : List<Sessie> = [];
  private errorMsg = "";

  constructor(private http: HttpClient, private afs: AngularFirestore,
     private firebaseStorage: AngularFireStorage ) { 
    
  }

  getSessies() {
    return this.afs.collection('sessies').valueChanges()
    /*console.log('halloo')
    try {
      let response = await this.afs.collection('sessies').valueChanges().toPromise();
      console.log(response)
      this._sessies = response.map(e => {
        return new Sessie(e['id'],
        e['naam'],
        e['beschrijving'],
        e['sessieCode'],
        e['oefeningen'] !=  undefined ? e['oefeningen'].map(oef => Oefening.fromJSON(oef)) : [])
      });
      console.log(this._sessies);
      return this._sessies;
    } catch(error) {
      this.errorMsg = error;
    }*/
    
  }
  

  getSessie(sessieId: number): Observable<Sessie> {
    const sessieRef : AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessieId}`);
    return sessieRef.valueChanges()
  }

  verwijderOefening(sessie: Sessie, oef : Oefening) {
    this.firebaseStorage.storage.refFromURL(oef.url).delete().then(() => this.uploadSessie(sessie)).catch(error => console.log('in catch'));
    //hierbij komt er een foutmelding in console maar het werkt wel, het lijkt alsof hij het 2 keer probeert te verwijderen
  }

  uploadSessie(sessie: Sessie) {
    const sessieRef: AngularFirestoreDocument<any> = this.afs.doc(`sessies/${sessie.id}`);
    const data = {
      naam: sessie.naam,
      beschrijving: sessie.beschrijving,
      oefeningen: sessie.oefeningen.map(oef => oef.toJSON()),
      id: sessie.id,
      sessieCode: "AAAAA"
    };
    return sessieRef.set(data, { merge: true });
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

  updateSessie(sessie: Sessie) {
    return this.http
      .put<Sessie>(globals.backendUrl + `/sessies`, sessie)
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
