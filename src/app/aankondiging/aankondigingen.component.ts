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

  constructor(private modal: NgbModal,private dialog: MatDialog, private dataService : SessieDataService ) {  }
      
  ngOnInit() {  
    this.getAankondigingen()  
  }

  ngOnChanged() {
    this.getAankondigingen()
  }

  getAankondigingen() {
    this.dataService.getAankondigingen().subscribe(
      data => {
        this.aankondigingen = data.map(e => {
          return new Aankondiging(e['id'],
          e['tekst'],
          new Date(e['datum']),
          e['groep'],
        );
        
      },
      (error: HttpErrorResponse) => {
        /*this.errorMsg = `Error ${
          error.status
          } while trying to retrieve sessies: ${error.error}`;*/
      }), 
      this.aankondigingen.sort((a, b) => {
        return a.datum.getTime() - b.datum.getTime();
      });
    }   
    )
    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    //console.log(date)
    //console.log(this.viewDate)
    //console.log(this.aankondigingen)
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

  /*addAnnouncement(announcement:Aankondiging): void{
    this.db.list<Aankondiging>('/Announcement').push(announcement)
    window.location.reload();
    
  }*/
  
}
