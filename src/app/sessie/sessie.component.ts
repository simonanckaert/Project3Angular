import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Sessie } from './sessie.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { OefeningComponent } from '../oefening/oefening.component';
import { Oefening } from '../oefening/oefening.model';
import { OefeningEmptyComponent } from '../oefening-empty/oefening-empty.component';
import { OefeningDataService } from '../oefening-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { SessieDataService } from '../sessie-data.service';

@Component({
  selector: 'app-sessie',
  templateUrl: './sessie.component.html',
  styleUrls: ['./sessie.component.css']
})
export class SessieComponent implements OnInit, OnChanges {
  @Input() public sessie: Sessie;
  public oefeningen: Oefening[] = [];
  public editMode = false;
  public errorMsg: string;
  public sessieFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private sessieDataService: SessieDataService,
    private fb: FormBuilder,
    public snackbar: MatSnackBar
  ) {}

  // Sessie form validation
  ngOnInit() {
    this.sessieFormGroup = this.fb.group({
      sessieNaam: [this.sessie.naam, [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: [this.sessie.beschrijving, [Validators.required]],
      sessieCode: [this.sessie.sessieCode]
    });
    //console.log(this.sessie)
  }

  ngOnChanges() {
    if (this.editMode) {
      this.toggleEditMode();
    }
  }

  // Open new dialog to edit exercise
  openDialog(oef: Oefening): void {
    this.dialog.open(OefeningComponent, {
      minWidth: 300,
      data: oef
    });
  }

  // Open new dialog to add exercise
  openEmptyDialog(): void {
    const dialogRef = this.dialog.open(OefeningEmptyComponent, {
      minWidth: 300,
      data: this.sessie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.oefeningen.push(result);
      }
    });
  }

  showSnackBar(message: string) {
    this.snackbar.open(message, '', {
      duration: 2000,
    });
  }

  // Go into edit mode
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.sessieFormGroup = this.fb.group({
      sessieNaam: [this.sessie.naam, [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: [this.sessie.beschrijving, [Validators.required]],
      sessieCode: [this.sessie.sessieCode]
    });
  }

  onNoClick(): void {
    this.toggleEditMode();
  }

  sessieOpslaan() {
    if (this.sessieFormGroup.valid) {
      this.sessie.naam = this.sessieFormGroup.value.sessieNaam;
      this.sessie.beschrijving = this.sessieFormGroup.value.sessieBeschrijving;
      this.sessie.sessieCode = this.sessieFormGroup.value.sessieCode;
      this.sessieDataService.uploadSessie(this.sessie);
      this.toggleEditMode();
      this.showSnackBar('Sessie succesvol gewijzigd!');
    }
  }

  verwijderSessie() {
    if (confirm('Ben je zeker dat je ' + this.sessie.naam + ' wilt verwijderen?')) {
      this.sessieDataService.verwijderSessie(this.sessie.id);
      this.showSnackBar('Sessie succesvol verwijderd! Gelieve een andere sessie te selecteren.')
    }
  }
}
