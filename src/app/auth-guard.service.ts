import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private af: AngularFireAuth) { }

  // Check if enough privileges to use all navigation
  canActivate(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    }
    // else
    this.router.navigate(['/login']);
    return false;
  }
}
