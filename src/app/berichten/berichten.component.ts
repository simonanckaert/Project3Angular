import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from "rxjs";
//import * as firebase from "firebase";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
//import { takeWhile } from "rxjs/operators";

@Component({
  selector: "app-berichten",
  templateUrl: "./berichten.component.html",
  styleUrls: ["./berichten.component.css"]
})
export class BerichtenComponent implements OnInit, OnDestroy {
  
  chatRef$: AngularFireList<any>;
  public klanten: ChatUser[] = [];
  public ongelezen: number[] = [];

  public gekozenChatUser: ChatUser = null;

  public chat$: Observable<any[]>;
  public messagesfb$: Observable<any>;
  public gelezenMessages$: Observable<any>;

  private huidigeGebruikerSub: Subscription;
  private gelezenChecker: Subscription;
  private initieleSubscription: Subscription;

  public _name: string = "";
  textChat: string = null;
  public messages: Message[] = null;

  constructor(
    public db: AngularFireDatabase,
    public af: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.chat$ = db.list("Chat").snapshotChanges();

    this.initieerLijsten();

    this.af.user.subscribe(au => {
      if (au) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `admins/${au.uid}`
        );
        const user = userRef.valueChanges();
        if (user) {
          user.subscribe(value => {
            this._name = value.displayName;
          });
        }
      }
    });
  }

  ngOnInit() {}

  //sluit alle observables
  ngOnDestroy() {
    this.initieleSubscription.unsubscribe();
    if (this.huidigeGebruikerSub) {
      this.huidigeGebruikerSub.unsubscribe();
    }
    if (this.gelezenChecker) {
      this.gelezenChecker.unsubscribe();
    }
  }

  //vult observables in om de lijsten van chat weer te geven.
  initieerLijsten() {
    this.initieleSubscription = this.chat$.subscribe(actions => {
      this.klanten = [];
      this.ongelezen = [];
      actions.forEach(action => {
        this.zoekKlant(action.key).subscribe(value => {
          
          let chatUser = new ChatUser();
          chatUser.naam = value;
          chatUser.uid = action.key;
        if(!this.klanten.find(a => a.uid === chatUser.uid)){
          this.klanten.push(chatUser);

        }
        });
        this.geefWeerOngelezen(action.key).subscribe(value => {
          let waarde: number = 0;
          value.forEach(v => {
            if (!v.gelezen) {
              waarde++;
            }
          });
          this.ongelezen.push(waarde);
        });
      });
    });
  }

  //haalt de naam van de klant op uit hun id die bij de chatberichten hoort en geeft deze terug als een observable.
  zoekKlant(id: String): Observable<any> {
    return this.db.object("Users/" + id + "/name").valueChanges();
  }

  //Sluit huidige subscriptions en zet de huidig geselecteerde gebruiker, roept ook de getgesprekken methode op.
  kiesGesprek(user: ChatUser) {
    if (this.huidigeGebruikerSub) {
      this.huidigeGebruikerSub.unsubscribe();
    }
    if (this.gelezenChecker) {
      this.gelezenChecker.unsubscribe();
    }
    this.gekozenChatUser = user;
    this.messages = [];
    this.messagesfb$ = this.db.list("Chat/" + user.uid).valueChanges();
    this.huidigeGebruikerSub = this.messagesfb$.subscribe(actions => {
      this.messages = [];
      actions.forEach(a => {
        let message = new Message();
        message.content = a.content;
        message.messageTime = a.messageTime;
        message.messageUser = a.messageUser;
        message.admin = true;
        //als er geen admin veldje bestaat, dan word de username van de messages opgehaald uit de db en ingesteld.
        if (a.admin === undefined) {
          message.admin = false;
          message.messageUser = this.gekozenChatUser.naam;
        }
        this.messages.push(message);
      });
    });
    this.controleerGelezen();
  }

  //Geeft observable terug die overeenkomt met de lijst van messages van gebruiker adh van zijn uid.
  geefWeerOngelezen(uid: String): Observable<any> {
    return this.db.list("Chat/" + uid).valueChanges();
  }

  //steekt adh van de gekozen gebruiker alle veldjes gelezen op true.
  controleerGelezen() {
    this.gelezenMessages$ = this.db
      .list("Chat/" + this.gekozenChatUser.uid)
      .snapshotChanges();
    this.gelezenChecker = this.gelezenMessages$.subscribe(actions => {
      this.initieleSubscription;
      actions.forEach(a => {
        this.db
          .list("Chat/" + this.gekozenChatUser.uid)
          .update(a.key, { gelezen: true });
      });
    });
  }

  //Haalt de tekst op uit het inputveldje, controleerd of deze leeg is en stuurt een bericht naar firebase met de huidige datum, gebruiker en zet het inputveldje dan op leeg
  stuurBericht(tekst: String) {
    if (tekst != "") {
      let messageTime = Date.now();

      //TODO: Haal huidige admin op en vul hier in.
      let messageUser = this._name;

      //workaround omdat de database niet ingevuld is met messageUser uit de db op messages vanuit de android kant.
      let admin = true;
      let gelezen = true;
      this.db
        .list("Chat/" + this.gekozenChatUser.uid)
        .push({ content: tekst, gelezen, messageTime, messageUser, admin });

      this.textChat = "";
    }
  }
}

export class Message {
  content: String;
  messageTime: String;
  messageUser: String;
  admin: boolean;
}

export class ChatUser {
  naam: String;
  uid: String;
  ongelezen: number;
}
