import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFireDatabase} from "@angular/fire/database";

import { FormGroup, FormBuilder } from '@angular/forms';
import { GebruikerDataService } from '../gebruiker-data.service';
import { Observable } from 'rxjs';
import { SessieDataService } from '../sessie-data.service';
import { Aankondiging } from '../aankondiging/aankondiging';
@Component({
    selector: 'app-dialog',
    templateUrl: './aankondigingdialog.html',
    styleUrls: ['./aankondigingdialog.css'],
   
  })
  
export class AankondigingenComponentDialog implements OnInit {
    form: FormGroup;
    aankondiging : string;
    date : Date;
    groep : string;
    //private _gebruikers: Observable<any[]>;
    public groepNummers = [];

constructor(private dialog: MatDialog, private db :AngularFireDatabase ,
    private fb: FormBuilder,public gService: GebruikerDataService,
    private dialogRef: MatDialogRef<AankondigingenComponentDialog>,
   @Inject(MAT_DIALOG_DATA) public data, private dataService: SessieDataService) { }

  ngOnInit() {
    this.setGroepen()
    this.form = this.fb.group({
      aankondiging: [this.aankondiging,[]],
      date: [this.date,[]],
      groep: [this.groep,[]],
      }
    ); 
  }

  setGroepen(/*result: any[]*/) {
  /*result.forEach(gebruiker => {
      if (this.groepNummers.indexOf(gebruiker.groepnr) === -1) {
        this.groepNummers.push(gebruiker.groepnr);
      }
    });*/
    this.groepNummers.push(1,2,3);
    this.groepNummers.sort();
  }

  save() {
    this.dataService.voegNieuweAankondigingToe(new Aankondiging(new Date().getTime().toString(),this.form.value.aankondiging,this.form.value.date,this.form.value.groep))
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}