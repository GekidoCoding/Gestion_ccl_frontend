import {Component, Input, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {addDays, addMonths, addWeeks, format, parseISO, startOfDay, subDays, subMonths, subWeeks} from 'date-fns';
import {Monthutil} from "../../util/month-util";
import {Mouvement} from '../../model/mouvement/mouvement';
import {MouvementService} from "../../services/mouvement/mouvement.service";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ClientDetailComponent} from "../../components/application/client-detail/client-detail.component";
import {MouvementAddComponent} from "../../components/application/mouvement-add/mouvement-add.component";
import {TypeMouvementService} from "../../services/type-mouvement/type-mouvement.service";
import {ModeleInfra} from "../../model/modele-infra/modele-infra";
import {ModeleInfraService} from "../../services/modele-infra/modele-infra.service";
import {ToastrService} from "ngx-toastr";

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
  newMouvement: Mouvement = new Mouvement();
  public filteredModeles: ModeleInfra[] = [];
  public modelesIds:string[]=[];
  public modelesInfraSelectionned: { [key: string]: boolean } = {};
  constructor(
      private mouvementService: MouvementService ,
      private modalService: NgbModal,
      private typeMouvementService: TypeMouvementService ,
      private modeleInfraService: ModeleInfraService,
      public toastr: ToastrService,

  ) {}

  ngOnInit(): void {
    this.loadCalendarData();
    this.loadModeles();
    this.titleMonth = Monthutil.toMonthString(this.viewDate);
  }

  loadModeles() {
    this.modeleInfraService.getAll().subscribe({
      next: (modeles) => {
        this.filteredModeles = modeles;
      },
      error: (error) => {
        console.error('Error loading modeles:', error);
        this.toastr.error('Error loading modeles:', error);
      }
    });
  }
  deleteSearchForm(){
    this.deleteInfrastructure();
    // this.modelesIds=[];
  }

  loadCalendarData(): void {
    this.isLoading = true;
    if(!this.infrastructure.id && this.modelesIds.length<=0 ){
      this.mouvementService.getCalendarData().subscribe({
        next: (mouvements: Mouvement[]) => {
          this.events = mouvements.map(mouvement => ({
            title: `${mouvement.infrastructure.nom || 'Événement'} \n 
             ${mouvement.typeMouvement.nom} de ${mouvement.client.nom}`,
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
      this.loadCalendarDataByCriteria();
    }

  }

  loadCalendarDataByCriteria(): void {
    this.isLoading = true;
    this.mouvementService.getCalendarDataByCriteria(this.infrastructure.id , this.modelesIds).subscribe({
      next: (mouvements: Mouvement[]) => {
        console.log("mouvements:"+JSON.stringify( mouvements));
        this.events = mouvements.map(mouvement => {

          return {
            title: `${mouvement.infrastructure.nom || 'Événement'} \n 
             ${mouvement.typeMouvement.nom} de ${mouvement.client.nom}`,
            start: parseISO(mouvement.periodeDebut),
            end: mouvement.periodeFin ? parseISO(mouvement.periodeFin) : undefined,
            color: {
              primary: mouvement.typeMouvement.nom === 'Réservation' ? '#f8f83f' : '#FF0000',
              secondary: mouvement.typeMouvement.nom === 'Réservation' ? '#c3c363' : '#FF9999'
            }
          };
        });

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
    this.loadCalendarData();
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
    // this.loadCalendarData();
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

  handleEventClick({ event }: { event: CalendarEvent }): void {
    console.log('Événement cliqué :', event);

    if (event.start) {
      this.viewDate = event.start;
      this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
      this.view = CalendarView.Day;
      this.titleMonth = Monthutil.toMonthString(this.viewDate);
      this.loadCalendarData();
    }
  }

  handleDayClick(event: any): void {
    if (event.day && event.day.date) {
      this.viewDate = event.day.date;
      this.viewDateString = format(this.viewDate, 'yyyy-MM-dd');
      const periodeDebut = this.viewDateString+" 00:01:00";
      const periodeFin = this.viewDateString+" 23:59:00";
      this.newMouvement.periodeDebut=periodeDebut;
      this.newMouvement.periodeFin=periodeFin;
      const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
      const component =  this.modalService.open(MouvementAddComponent , options);
      component.componentInstance.newItem = this.newMouvement;
    }
  }
  updateModeleSelection(modeleId: string) {
    if (this.modelesInfraSelectionned[modeleId]) {
      if (!this.modelesIds.includes(modeleId)) {
        this.modelesIds.push(modeleId);
      }
    } else {
      this.modelesIds = this.modelesIds.filter(id => id !== modeleId);
    }

    console.log(this.modelesIds);
  }

}