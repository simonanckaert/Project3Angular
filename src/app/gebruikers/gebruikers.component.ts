import { Component, OnInit } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../data.service';
import { Gebruiker } from './gebruiker.model';

// Extra interface used for groups display
export interface Groep {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-gebruikers',
  templateUrl: './gebruikers.component.html',
  styleUrls: ['./gebruikers.component.css']
})
export class GebruikersComponent implements OnInit {
  gebruikers: Gebruiker[] = [];
  groepsnummers: number[] = [];

  public selectedGroepNr = 'Ø';
  public selectedGroep = 'Alle gebruikers';
  public displayedColumns: string[] = ['name', 'email', 'regio','telnr', 'group', 'delete'];
  public dataSource: MatTableDataSource<any>;
  public displayedColumnsAdd: string[] = ['name', 'email', 'regio','telnr', 'group', 'add'];
  public dataSourceAll: MatTableDataSource<any>;

  constructor(
    public af: AngularFireAuth,
    public serviceData: DataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    this.getGebruikers();
  }

  ngOnInit() { }

  // Fetch all users from db
  getGebruikers() {
    this.serviceData.getGebruikers().subscribe(result => {
      this.gebruikers = result.map(e => new Gebruiker(e['uid'], e['email'], e['groepnr'], e['name']));
      this.setGroepen()
    });
  }

  // Initial setup groups
  setGroepen() {
    this.gebruikers.forEach(gebruiker => {
      if (!this.groepsnummers.includes(gebruiker.groep)) {
        this.groepsnummers.push(gebruiker.groep);
      }
    })
    this.voegOvergeslagenNummersToe();
    this.groepsnummers.sort();
    this.gebruikGroepFilter('Ø');
  }

  voegOvergeslagenNummersToe() {
    for(let index = 0; index < this.groepsnummers.length; index++) {
      if(!this.groepsnummers.includes(index)) {
        this.groepsnummers.push(index);
      }
    }
  }

  // Filter list by name
  gebruikFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Apply filter on group change
  gebruikGroepFilter(filterValue: string) {
    this.serviceData.getGebruikers().subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSourceAll = new MatTableDataSource(result);
      if (filterValue !== 'Ø') {
        const newData = [];
        this.dataSource.data.forEach(element => {
          if (element.groepnr === filterValue) {
            newData.push(element);
          }
        });
        this.dataSource = new MatTableDataSource(newData);
        this.selectedGroep = 'Groep ' + filterValue;
        this.selectedGroepNr = filterValue;
        const newDataAll = [];
        this.dataSourceAll.data.forEach(element => {
          if (element.groepnr !== filterValue) {
            newDataAll.push(element);
          }
        });
        this.dataSourceAll = new MatTableDataSource(newDataAll);
      } else {
        this.dataSource = this.dataSourceAll;
        this.selectedGroep = 'Alle gebruikers';
        this.selectedGroepNr = 'Ø';
      }
    });
  }

  // Update list data when not showing all users ('Ø' page)
  updateListData() {
    this.dataSource = new MatTableDataSource(this.gebruikers);
    this.dataSourceAll = new MatTableDataSource(this.gebruikers);
    const newData = [];
    this.dataSource.data.forEach(element => {
      if (element.groepnr === this.selectedGroepNr) {
        newData.push(element);
      }
    });
    this.dataSource = new MatTableDataSource(newData);
    const newDataAll = [];
    this.dataSourceAll.data.forEach(element => {
      if (element.groepnr !== this.selectedGroepNr) {
        newDataAll.push(element);
      }
    });
    this.dataSourceAll = new MatTableDataSource(newDataAll);
  }

  // Change the groupnr of a user
  changeGroup(gebruiker, nr) {
    gebruiker.groep = nr;
    this.serviceData.uploadGebruiker(gebruiker);
    this.showSnackBar(gebruiker.name, 'ok');
  }

  // Show snackbar on groupnr change
  showSnackBar(naam: string, action: string) {
    this.snackbar.open(
      'Groep van ' + naam + ' succesvol gewijzigd!',
      action,
      {
        duration: 2000
      }
    );
  }

  // Add a new group
  addGroup() {
    const n: number = this.groepsnummers[this.groepsnummers.length - 1] + 1;
    this.groepsnummers.push(n);
  }

  // Show alert dialog before removing user
  removeUser(uid): void {
    if(confirm('Zeker dat u deze gebruiker wilt verwijderen?')) {
      this.serviceData.verwijderGebruiker(uid)
    }
  }
}
