import { Injectable } from '@angular/core';
import { Sessie } from './sessie/sessie.model';
import * as globals from '../globals/globals';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import * as firebase from 'firebase';
import { List } from 'lodash';
import { Oefening } from './oefening/oefening.model';

@Injectable({
  providedIn: 'root'
})
export class SessieDataService {
  private _sessies : List<Sessie> = [];
  private errorMsg = "";

  constructor(private http: HttpClient, private afs: AngularFirestore, private firebase : AngularFireModule) { 
    
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
    return this.http
      .get<Sessie>(globals.backendUrl + `/sessies/` + sessieId)
      .pipe();
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

  verwijderSessie(sessie: Sessie) {
    return this.http
      .delete(globals.backendUrl + '/sessies/' + sessie.id)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

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
