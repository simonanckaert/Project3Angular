import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private _aangemeld: BehaviorSubject<boolean>;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public af: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) { }

  // If user is admin set logged in & enable navigation
  ngOnInit() {
    this.af.authState.subscribe(user => {
      this.af.user.subscribe(au => {
        if (au) {
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`admins/${au.uid}`);
          const usr = userRef.valueChanges();
          if (usr) {
            usr.subscribe(value => {
              if (value) {
                this._aangemeld = new BehaviorSubject<boolean>(true);
              } else {
                this._aangemeld = new BehaviorSubject<boolean>(false);
              }
            });
          }
        } else {
          this._aangemeld = new BehaviorSubject<boolean>(false);
        }
      });
    });
  }

  get aangemeld(): Boolean {
    let bool = false;
    if (this._aangemeld) {
      this._aangemeld.subscribe(value => {
        bool = value;
      });
    }
    return bool;
  }

  logout() {
    this.af.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this._aangemeld = new BehaviorSubject<boolean>(false);
      this.router.navigateByUrl('/login');
    });
  }
}
