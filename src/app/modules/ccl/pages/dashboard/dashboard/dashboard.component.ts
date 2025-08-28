import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartDataset } from 'chart.js';
import { registerables } from 'chart.js';
import { DashboardService } from "../../../services/dashboard/dashboard.service";
import { ToastrService } from "ngx-toastr";
import {HistoriqueMvtService} from "../../../services/historique-mvt/historique-mvt.service";
import {HistoriqueMvt} from "../../../model/historique-mvt/historique-mvt";
import {TypeMouvement} from "../../../model/type-mouvement/type-mouvement";
import {TypeMouvementService} from "../../../services/type-mouvement/type-mouvement.service";
import {ModeleInfra} from "../../../model/modele-infra/modele-infra";
import {ModeleInfraService} from "../../../services/modele-infra/modele-infra.service";
import {CategorieInfra} from "../../../model/categorie-infra/categorie-infra";
import {CategorieInfraService} from "../../../services/categorie-infra/categorie-infra.service";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;

  public date1: string = '';
  public date2: string = '';
  public year: number = 2025;
  public loading: boolean = false;
  private pendingRequests: number = 0;

  private pieChartInstance: Chart | null = null;
  private lineChartInstance: Chart | null = null;
  public historiques :HistoriqueMvt[]=[];
  public typeMouvements : TypeMouvement[] =[];
  public typeMouvementId:string=''
  public categories:CategorieInfra[]=[];
  public categorieInfraId:string='';

  public statsCards = [
    { title: 'Réservation(s)', value: 0, icon: 'fas fa-calendar-check', color: 'yellow' },
    { title: 'Renseignement(s)', value: 0, icon: 'fas fa-info-circle', color: 'green' },
    { title: 'Infrastructure(s)', value: 0, icon: 'fas fa-building', color: 'red' },
    { title: 'Client(s)', value: 0, icon: 'fas fa-users', color: 'blue' }
  ];

  pieData: number[] = [];
  pieColors = ['rgba(136,136,136,0.87)', '#28a745', 'rgb(181, 157, 5)', '#dc3545'];
  pieLabels = ['Classement', 'Renseignement', 'Reservation', 'Occupation'];

  public lineChartDatasets: ChartDataset<'line'>[] = [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Réservations',
      borderColor: '#28a745',
      backgroundColor: 'rgba(40,167,69,0.45)',
      fill: true,
      tension: 0.4
    },
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Renseignements',
      borderColor: '#ffc107',
      backgroundColor: 'rgba(255,187,0,0.42)',
      fill: true,
      tension: 0.4
    },
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Clients',
      borderColor: '#dc3545',
      backgroundColor: 'rgba(251,41,63,0.34)',
      fill: true,
      tension: 0.4
    }
  ];

  public lineChartLabels: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  recentActivities = [
    { text: 'Nouvel utilisateur inscrit : Jean Dupont', date: 'Il y a 2h' },
    { text: 'Commande #4579 expédiée', date: 'Il y a 5h' },
    { text: 'Serveur redémarré avec succès', date: 'Hier' }
  ];

  constructor(private dashboardService: DashboardService, public toastr: ToastrService ,
              private historiqueMvtService: HistoriqueMvtService,
              private typeMouvementService: TypeMouvementService,
              private categorieInfraService: CategorieInfraService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadTypeMouvements();
  }

  loadTypeMouvements() {
    this.typeMouvementService.getAll().subscribe({
      next: (types) => {
        this.typeMouvements = types;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de mouvement:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvement');
      }
    });
  }

  onFilterSubmit(): void {
    this.loadData();
  }
  onFilterHistoriques(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.pendingRequests = 4;
    this.getActivitiesHistoriques();
    this.getTotalDashboard();
    this.getPourcentageDashboard();
    this.getLineChartDataDashboard();
    this.loadCategories();
  }

  loadCategories() {
    this.categorieInfraService.getAll().subscribe({
      next: (modeles) => {
        this.categories = modeles;
      },
      error: (error) => {
        console.error('Error loading modeles:', error);
        this.toastr.error('Erreur lors du chargement des modèles');
      }
    });
  }
  private checkLoadingComplete(): void {
    this.pendingRequests--;
    if (this.pendingRequests === 0) {
      this.loading = false;
    }
  }

  getTotalDashboard() {
    this.dashboardService.getTotalDashboard(this.date1, this.date2, this.year).subscribe({
      next: (totals) => {
        console.log(JSON.stringify(totals));
        this.statsCards[0].value = totals[0];
        this.statsCards[1].value = totals[1];
        this.statsCards[2].value = totals[2];
        this.statsCards[3].value = totals[3];
      },
      error: (err) => {
        console.error('Error fetching total dashboard:', err);
        this.toastr.error('Erreur lors du chargement des totaux');
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });
  }

  getPourcentageDashboard() {
    this.dashboardService.getPourcentageDashboard(this.date1, this.date2, this.year).subscribe({
      next: (totals) => {
        console.log("pourcentage:" + JSON.stringify(totals));
        this.pieData = totals;
        this.initPieChart();
      },
      error: (err) => {
        console.error('Error fetching pourcentage dashboard:', err);
        this.toastr.error('Erreur lors du chargement des etats statistiques');
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });
  }

  getLineChartDataDashboard() {
    this.dashboardService.getMonthlyData(this.date1, this.date2, this.year).subscribe({
      next: (data) => {
        console.log("line Charts:" + JSON.stringify(data));
        this.lineChartDatasets[0].data = data[0];
        this.lineChartDatasets[1].data = data[1];
        this.lineChartDatasets[2].data = data[2];
        this.initLineChart();
      },
      error: (err) => {
        console.error('Error fetching monthly data:', err);
        this.toastr.error('Erreur lors du chargement des data du Line Chart');
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });
  }
  getActivitiesHistoriques():void{
    this.loading = true;
    this.historiqueMvtService.getHistoriqueMvtsCriteria(this.date1, this.date2, this.year , this.categorieInfraId , this.typeMouvementId).subscribe({
      next: (data) => {
        this.historiques = data;
      },
      error: (err) => {
        console.error('Error fetching activities historiques:', err);
        this.toastr.error('Erreur lors du chargement des historiques');
      },
      complete: () => {
        this.loading=false;
      }

    })
  }


  initPieChart(): void {
    if (!this.pieChartRef || !this.pieChartRef.nativeElement) {
      console.error('Pie chart canvas not found');
      return;
    }

    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
      this.pieChartInstance = null;
    }

    if (!this.pieData || this.pieData.length !== 4 || this.pieData.every(val => val === 0)) {
      console.warn('Invalid or empty pieData, using fallback values');
      this.pieData = [25, 25, 25, 25];
    }

    this.pieChartInstance = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.pieLabels,
        datasets: [{
          data: this.pieData,
          backgroundColor: this.pieColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 20,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    });
  }

  initLineChart(): void {
    if (!this.lineChartRef || !this.lineChartRef.nativeElement) {
      console.error('Line chart canvas not found');
      return;
    }

    // Destroy existing line chart if it exists
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
      this.lineChartInstance = null;
    }

    this.lineChartInstance = new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.lineChartLabels,
        datasets: this.lineChartDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Month (' + this.year + ')',
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valeurs'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 20,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    });
  }
}