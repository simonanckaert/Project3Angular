import { Component, OnInit, Inject } from '@angular/core';
import { Sessie } from '../sessie/sessie.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { SessieDataService } from '../sessie-data.service';

@Component({
  selector: 'app-sessie-empty',
  templateUrl: './sessie-empty.component.html',
  styleUrls: ['./sessie-empty.component.css']
})
export class SessieEmptyComponent implements OnInit {
  public sessieFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SessieEmptyComponent>,
    private _sessieDataService: SessieDataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { 
    console.log(this.id);
  }

  // Sessie form validation
  ngOnInit() {
    this.sessieFormGroup = this.fb.group({
      sessieNaam: ['', [Validators.required, Validators.minLength(4)]],
      sessieBeschrijving: ['', [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sessieOpslaan() {
    if (this.sessieFormGroup.valid) {
      const sessie = new Sessie(
        this.id,
        this.sessieFormGroup.value.sessieNaam,
        this.sessieFormGroup.value.sessieBeschrijving
      );
      //console.log(sessie)

      this.dialogRef.close(
        this._sessieDataService.uploadSessie(sessie)
      );
    }
  }
}
