import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as globals from '../globals/globals';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _throw } from 'rxjs/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class GebruikerDataService {

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(globals.backendUrl + `/users`);
  }

  getUserById(uid: string): Observable<any> {
    return this.http.get<any[]>(globals.backendUrl + `/users/` + uid);
  }

  updateUser(uid: string, user): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const url = globals.backendUrl + `/users/` + uid;
    return this.http.put<any>(url, user, httpOptions);
  }

  removeUser(uid: string): Observable<any> {
    return this.http.delete(globals.backendUrl + '/users/' + uid)
  }
}
