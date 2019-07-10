import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { GebruikerDataService } from '../gebruiker-data.service';
import { VerwijderAlertComponent } from '../verwijder-alert/verwijder-alert.component';

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
  private _gebruikers: Observable<any[]>;
  public groepen: Groep[] = [];
  public groepNummers = ['Ø'];
  public selectedGroepNr = 'Ø';
  public selectedGroep = 'Alle gebruikers';
  public displayedColumns: string[] = ['name', 'email', 'group', 'delete'];
  public dataSource: MatTableDataSource<any>;
  public displayedColumnsAdd: string[] = ['name', 'email', 'group', 'add'];
  public dataSourceAll: MatTableDataSource<any>;

  constructor(
    public afDb: AngularFireDatabase,
    public af: AngularFireAuth,
    public gService: GebruikerDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    this._gebruikers = this.getUsers();
    this._gebruikers.subscribe(result => {
      this.setGroepen(result);
      // Initial setup data listviews
      this.dataSource = new MatTableDataSource(result);
      this.dataSourceAll = new MatTableDataSource(result);
    });
  }

  ngOnInit() { }

  // Fetch all users from db
  getUsers(): Observable<any[]> {
    return this.gService.getUsers();
  }

  // Initial setup groups
  setGroepen(result: any[]) {
    result.forEach(gebruiker => {
      if (
        gebruiker.groepnr !== undefined &&
        this.groepNummers.indexOf(gebruiker.groepnr) === -1 &&
        gebruiker.groepnr !== '0'
      ) {
        this.groepNummers.push(gebruiker.groepnr);
      }
    });

    const subList = this.groepNummers.slice(1, this.groepNummers.length + 1);
    subList.sort();

    this.groepNummers = ['Ø'];
    this.groepNummers = this.groepNummers.concat(subList);

    this.groepNummers.forEach(nummer => {
      if (nummer !== 'Ø') {
        this.groepen.push({ value: nummer, viewValue: 'Groep ' + nummer });
      } else {
        this.groepen.push({ value: '0', viewValue: 'Geen groep' });
      }
    });
  }

  // Filter list by name
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Apply filter on group change
  applyGroepFilter(filterValue: string) {
    this._gebruikers.subscribe(result => {
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
    if (this.selectedGroepNr !== 'Ø') {
      this._gebruikers.subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSourceAll = new MatTableDataSource(result);
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
      });
    }
  }

  // Change the groupnr of a user
  changeGroup(uid, nr) {
    const gebruiker = this.gService.getUserById(uid);
    gebruiker.subscribe(result => {
      let telnr = 0;
      if (result.telnr) {
        telnr = result.telnr;
      }

      let sessieid = '';
      if (result.sessieid) {
        sessieid = result.sessieid;
      }

      let regio = '';
      if (result.regio) {
        regio = result.regio;
      }

      const updatedGebruiker = {
        email: result.email,
        groepnr: nr.value.toString(),
        name: result.name,
        telnr: telnr,
        regio: regio,
        sessieid: sessieid
      };
      this.gService
        .updateUser(uid, updatedGebruiker)
        .subscribe();
      this.showSnackBar(updatedGebruiker.name, 'ok');

      this.updateListData();
    });
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
    const n: number = +this.groepen[this.groepen.length - 1].value + 1;
    console.log(n);
    this.groepen.push({ value: n.toString(), viewValue: 'Groep ' + n });
    this.groepNummers.push(n.toString());
  }

  // Show alert dialog before removing user
  removeUser(uid): void {
    const gebruiker = this.gService.getUserById(uid);
    gebruiker.subscribe(result => {
      const dialogRef = this.dialog.open(VerwijderAlertComponent, {
        minWidth: 300,
        data: {
          dataName: result.name,
          dataSentence: 'Ben je zeker dat je deze gebruiker wilt verwijderen?',
          dataId: uid
        }
      });

      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          // Remove user
          this.gService.removeUser(uid).subscribe(res => {
            console.log(res);
          });
          this._gebruikers = this.getUsers();
          this._gebruikers.subscribe(res => {
            // this.setGroepen(res);
            this.dataSource = new MatTableDataSource(res);
            console.log(this.dataSource.data);
          });
        }
      });
    });
  }
}
