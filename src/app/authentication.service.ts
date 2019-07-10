import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public aangemeld: Boolean = false;

  constructor(private af: AngularFireAuth) {
    if (this.af.user) {
      this.aangemeld = true;
    }
   }
}
