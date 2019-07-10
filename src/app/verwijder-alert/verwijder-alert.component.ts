import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-verwijder-alert',
  templateUrl: './verwijder-alert.component.html',
  styleUrls: ['./verwijder-alert.component.css']
})

export class VerwijderAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<VerwijderAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
