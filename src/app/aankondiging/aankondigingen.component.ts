import { Component, OnInit, ChangeDetectionStrategy , ViewChild,TemplateRef , Injectable} from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarView
} from 'angular-calendar';
import {CalendarEvent} from'./calendarUtils';
import { MatDialog} from '@angular/material/dialog';
import { AngularFireDatabase,AngularFireList } from "@angular/fire/database";
import { Aankondiging } from './aankondiging';
import { AankondigingenComponentDialog } from '../aankondiging-empty/aankondigingdialog.component';
import { Observable } from 'rxjs';
import { SessieDataService } from '../sessie-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-aankondigingen',
  templateUrl: './aankondigingen.component.html',
  styleUrls: ['./aankondigingen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AankondigingenComponent implements OnInit {

  @ViewChild('modalContent',null)
  modalContent: TemplateRef<any>;

   view: CalendarView = CalendarView.Month;
 
   CalendarView = CalendarView;
   announcementList: AngularFireList<Aankondiging> = null;
   announcementfirebase: AngularFireList<Aankondiging> ;
   locale: string = 'nl-BE';
   aankondigingen : Aankondiging[];
   items: Observable<any>;
   item: Observable<any>;
   viewDate: Date = new Date();
 
   modalData: {
     action: string;
     event: CalendarEvent;
   };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[]  = [];

  activeDayIsOpen: boolean = true; 

  constructor(private modal: NgbModal,private dialog: MatDialog, private dataService : SessieDataService, public snackbar: MatSnackBar ) {}
      
  ngOnInit() {  
    this.getAankondigingen()  
  }

  ngOnChanged() {
    //this.getAankondigingen()
  }

  getAankondigingen() {
    this.dataService.getAankondigingen().subscribe(
      data => {
        this.aankondigingen = data.map(e => {
          return new Aankondiging(e['id'],
          e['title'],
          new Date(e['start']),
          e['groep'],
        );
        
      },
      (error: HttpErrorResponse) => {
        /*this.errorMsg = `Error ${
          error.status
          } while trying to retrieve sessies: ${error.error}`;*/
      }), 
      this.aankondigingen.sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      });
      this.aankondigingen.forEach(aankondiging => this.checkAlsDatumGepasseerdIs(aankondiging));
      this.aankondigingen.forEach(aankondiging => this.events.push(aankondiging));
    }   
    )
  }

  private checkAlsDatumGepasseerdIs(aankondiging: Aankondiging) {
    let vandaag = new Date();
    vandaag.setHours(0,0,0,0)
    if(moment(aankondiging.start).isBefore(vandaag)) {
      this.verwijderAankondiging(aankondiging.id)
    }
  }

  private verwijderAankondiging(id: string) {
    this.dataService.verwijderAankondiging(id)
  }

  private bevestigVerwijderenAankondiging(aankondiging: Aankondiging) {
    if(confirm(`Zeker dat u ${aankondiging.title} wilt verwijderen?`)) {
      this.verwijderAankondiging(aankondiging.id);
    }
    this.snackbar.open('Aankondiging is verwijderd')
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }
 
  openDialog(): void{
    this.dialog.open(AankondigingenComponentDialog, {
      minWidth: 300,
      maxHeight: 300
    }); 
  }

  showSnackBar(message: string) {
    this.snackbar.open(message, '', {
      duration: 200,
    });
  }
}
