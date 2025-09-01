import {Component, Input, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {addDays, addMonths, addWeeks, format, parseISO, startOfDay, subDays, subMonths, subWeeks} from 'date-fns';
import {Monthutil} from "../../util/month-util";
import {Mouvement} from '../../model/mouvement/mouvement';
import {MouvementService} from "../../services/mouvement/mouvement.service";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  @Input() infrastructure: Infrastructure = new Infrastructure();

  public isLoading = false;
  public MonthUtil = Monthutil;
  public CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  viewDateString: string = format(new Date(), 'yyyy-MM-dd');
  events: CalendarEvent[] = [];
  titleMonth: string = '';

  constructor(
      private mouvementService: MouvementService ,
      private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadCalendarData();
    this.titleMonth = Monthutil.toMonthString(this.viewDate);
  }

  loadCalendarData(): void {
    this.isLoading = true;
    if(!this.infrastructure.id){
      this.mouvementService.getCalendarData().subscribe({
        next: (mouvements: Mouvement[]) => {
          this.events = mouvements.map(mouvement => ({
            title: `${mouvement.infrastructure.nom || 'Événement'} - ${mouvement.typeMouvement.nom}`,
            start: parseISO(mouvement.periodeDebut),
            end: mouvement.periodeFin ? parseISO(mouvement.periodeFin) : undefined,
            color: {
              primary: mouvement.typeMouvement.nom === 'Réservation' ? '#f8f83f' : '#FF0000',
              secondary: mouvement.typeMouvement.nom === 'Réservation' ? '#c3c363' : '#FF9999'
            }
          }));

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load calendar data:', error);
          this.isLoading = false;
        }
      });
    }
    else{
      this.loadCalendarDataByInfraId();
    }

  }

  loadCalendarDataByInfraId(): void {
    this.isLoading = true;
    this.mouvementService.getCalendarDataByInfrastructureId(this.infrastructure.id).subscribe({
      next: (mouvements: Mouvement[]) => {
        this.events = mouvements.map(mouvement => ({
          title: `${mouvement.infrastructure.nom || 'Événement'} - ${mouvement.typeMouvement.nom}`,
          start: parseISO(mouvement.periodeDebut),
          end: mouvement.periodeFin ? parseISO(mouvement.periodeFin) : undefined,
          color: {
            primary: mouvement.typeMouvement.nom === 'Réservation' ? '#f8f83f' : '#FF0000',
            secondary: mouvement.typeMouvement.nom === 'Réservation' ? '#c3c363' : '#FF9999'
          }
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load calendar data:', error);
        this.isLoading = false;
      }
    });
  }

  deleteInfrastructure(): void {
    this.infrastructure=new Infrastructure();
    this.loadCalendarData();
  }


  onDateChange(date: string): void {
    if (date) {
      this.viewDate = startOfDay(parseISO(date));
      this.viewDateString = date;
      this.titleMonth = Monthutil.toMonthString(this.viewDate);
      this.loadCalendarData(); // Reload data when date changes
    }
  }

  goToPrevious(): void {
    if (this.view === CalendarView.Month) {
      this.viewDate = subMonths(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = subWeeks(this.viewDate, 1);
    } else {
      this.viewDate = subDays(this.viewDate, 1);
    }
    this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
    this.titleMonth = Monthutil.toMonthString(this.viewDate);
    this.loadCalendarData(); // Reload data when navigating to previous
  }

  goToNext(): void {
    if (this.view === CalendarView.Month) {
      this.viewDate = addMonths(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, 1);
    } else {
      this.viewDate = addDays(this.viewDate, 1);
    }
    this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
    this.titleMonth = Monthutil.toMonthString(this.viewDate);
    this.loadCalendarData(); // Reload data when navigating to next
  }

  handleInfrastructureSelected(infra: Infrastructure, content: any) {
    this.infrastructure = { ...infra, capacite: infra.capacite ?? 1 };
    this.infrastructure = infra;

    this.loadCalendarData();
    content.dismiss('Cross Click');
    console.log('Selected infrastructure:', this.infrastructure);
  }

  goToToday() : void {
    this.viewDate = new Date();
    this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
    this.titleMonth = Monthutil.toMonthString(this.viewDate);
    this.loadCalendarData(); // Reload data when navigating to today
  }
  openPopup(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  handleDayClick(event: any): void {
    // if (event.day && event.day.date) {
    //   this.viewDate = event.day.date;
    //   this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
    //   this.view = CalendarView.Day;
    //   this.titleMonth = Monthutil.toMonthString(this.viewDate);
    //   this.loadCalendarData(); // Reload data when a day is clicked
    // }
  }
}