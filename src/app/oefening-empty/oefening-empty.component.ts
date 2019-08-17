import { Component, OnInit, Inject } from '@angular/core';
import { Oefening } from '../oefening/oefening.model';
import { Sessie } from '../sessie/sessie.model';
import { MatDialogRef } from '@angular/material';
import { OefeningDataService } from '../oefening-data.service';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GebruikerDataService } from '../gebruiker-data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AngularFireStorage } from '@angular/fire/storage';
import { SessieDataService } from '../sessie-data.service';

@Component({
  selector: 'app-oefening-empty',
  templateUrl: './oefening-empty.component.html',
  styleUrls: ['./oefening-empty.component.css']
})
export class OefeningEmptyComponent implements OnInit {

  public loading = false;
  public oefeningFormGroup: FormGroup;
  public groepNummers = [];
  public selectedGroepnummers = [];

  private file: File;

  constructor(public dialogRef: MatDialogRef<OefeningEmptyComponent>, @Inject(MAT_DIALOG_DATA) public sessie: Sessie,
    public dataService: SessieDataService, private fb: FormBuilder, private ngxService: NgxUiLoaderService, 
    private firebaseStorage: AngularFireStorage) {
    this.dataService.getGebruikers().subscribe(result => {
      this.setGroepen(result);
    });
    //console.log("in oefempty")
    //console.log(sessie)
    //this.setGroepen(null);
  }

  // Set available groupnrs
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

  // Close dialog after cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Exercise validation
  ngOnInit() {
    this.oefeningFormGroup = this.fb.group({
      oefeningNaam: ['', [Validators.required, Validators.minLength(4)]],
      oefeningBeschrijving: ['', [Validators.required]]
    });
  }

  // Add to group (set checked)
  checkGroep(result, nummer) {
    if (result.checked) {
      this.selectedGroepnummers.push(nummer);
    } else {
      const index: number = this.selectedGroepnummers.indexOf(nummer);
      if (index !== -1) {
        this.selectedGroepnummers.splice(index, 1);
      }
    }
  }

  // Save exercise
  oefeningOpslaan() {
    if (this.oefeningFormGroup.valid) {
      this.ngxService.start();
      const oefening = new Oefening(this.oefeningFormGroup.value.oefeningNaam,
      this.oefeningFormGroup.value.oefeningBeschrijving, this.sessie.id);
      let groepen = '';
      this.selectedGroepnummers.forEach(element => {
        groepen = groepen + element + ',';
      });
      groepen = groepen.slice(0, -1);

      //uploaden bestand, daarna pas de oefening
      var storageRef = this.firebaseStorage.ref(this.file.name)
      storageRef.put(this.file).then(() => {     
        this.firebaseStorage.ref(this.file.name).getDownloadURL().toPromise().then(result => {
          oefening.oefeningId = this.sessie.oefeningen.length
          oefening.url = result
          oefening.groepen = groepen;
          oefening.file = this.file;
          oefening.fileMimetype = this.file.type;
          oefening.fileName = this.file.name;
          oefening.fileOriginalName = this.file.name;
          oefening.fileSize = this.file.size;
          this.sessie.addOefening(oefening);
          this.dialogRef.close(this.dataService.uploadSessie(this.sessie));
        }).finally(() => this.ngxService.stop())
      })


    }
  }

  // If file is uploaded set current _file
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
}
