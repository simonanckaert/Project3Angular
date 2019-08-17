import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
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
  public groepNummers = [];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AankondigingenComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getGebruikers().subscribe(result => {
      this.setGroepen(result);
    });
    this.form = this.fb.group({
      aankondiging: [this.aankondiging,[]],
      date: [this.date,[]],
      groep: [this.groep,[]],
      }
    ); 
  }

  setGroepen(result: any[]) {
    result.forEach(gebruiker => {
      if (this.groepNummers.indexOf(gebruiker.groepnr) === -1) {
        this.groepNummers.push(gebruiker.groepnr);
      }
    });
    this.voegOvergeslagenNummersToe();
    this.groepNummers.sort();
  }

  voegOvergeslagenNummersToe() {
    for(let index = 0; index < this.groepNummers.length; index++) {
      if(!this.groepNummers.includes(index)) {
        this.groepNummers.push(index);
      }
    }
  }

  save() {
    this.dataService.voegNieuweAankondigingToe(new Aankondiging(new Date().getTime().toString(),this.form.value.aankondiging,this.form.value.date,this.form.value.groep))
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}