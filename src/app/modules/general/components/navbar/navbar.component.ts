import {Component, OnInit, ElementRef, OnDestroy, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';
import { User } from '../../model/user';
import { Subscription } from 'rxjs';
import { NavItem } from '../../model/nav-item';
import { StateService } from '../../services/state.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Notification} from "../../../ccl/model/notification/notification";
import {TypeNotification} from "../../../ccl/model/type-notification/type-notification";
import {TypeNotificationService} from "../../../ccl/services/type-notification/type-notification.service";
import {NotificationService} from "../../../ccl/services/notification/notification.service";
import {
  DetailInfrastructureComponent
} from "../../../ccl/components/infrastructure/detail-infrastructure/detail-infrastructure.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  MouvementDetailComponent
} from "../../../ccl/components/mouvement/mouvement-detail/mouvement-detail.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() notifToggle = new EventEmitter<boolean>();

  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  private userSubscription: Subscription | null = null;
  subsState: Subscription = new Subscription();
  items: NavItem[] = [];
  user: User | null = null;
  userImageUrl: string = 'assets/img/user.png';
  notificationSidebarOpen: boolean = false;

  notificationFilter: string = '';

  totalNotifsNonLus: number = 0;
  notifications:Notification[] = [];
  filteredNotifications: Notification[] = [];

  FILE_STORAGE: string = environment.FILE_STORAGE;

  nb_message = 0;
  es: EventSource | null = null;
  token: any;

  typeNotifications: TypeNotification[] = [];

  constructor(
      private toastr: ToastrService,
      location: Location,
      private element: ElementRef,
      private router: Router,
      private account: AccountService,
      private state: StateService,
      private httpClient: HttpClient,
      private ref: ChangeDetectorRef,
      private typeNotificationService: TypeNotificationService,
      private notificationService: NotificationService,
      private modal:NgbModal,
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }
  config: any;

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.subsState.unsubscribe();
    if (this.es != null) {
      this.es.close();
    }
  }

  ngOnInit() {
    const headers = new HttpHeaders()
        .set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache');

    this.httpClient
        .get<any>('/assets/config.json', { headers })
        .subscribe((config) => {
          this.config = config;
          this.ref.detectChanges();
          this.initSideBar();
        });
    this.subsState = this.state.nav.subscribe((res) => {
      this.items = res as NavItem[];
    });
    this.userSubscription = this.account.user.subscribe((res) => {
      if (res != null) {
        this.user = res;
        this.userImageUrl = this.user?.matricule ? `${this.FILE_STORAGE}/files/agent/${this.user.matricule}` : 'assets/img/user.png';
        this.token = this.account.getToken();
        this.loadData(); // <-- charge notifications après user dispo
      } else if (res == null && this.account.getMatricule() != null) {
        this.getAgent();
      }
    });

  }

  getNotificationClass(n: Notification): string {
    if (!n) return '';
    console.log(JSON.stringify( n));
    console.log(JSON.stringify(n.read));
    if (n.read) {
      return 'read';
    }


    const lib = (n.typeNotification?.libelle || '').trim().toLowerCase();
    if (lib === 'danger') return 'danger';
    if (lib === 'signalement') return 'signalement';
    return '';
  }

  markAllread(){
    this.notificationService.markAllread().subscribe(() => {
      this.loadData();
      this.toastr.success(`Notification(s) #tout marquée(s) comme lue(s)`);
    })
  }

  markAsRead(id:string) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.loadData();
        this.toastr.success(`Notification #${id} marquée comme lue`);
      },
      error: () => {
        this.toastr.error(`Notification #${id} non marquée comme lue`);
      },
    })
  }

  loadData(){
    this.loadNotifications();
    this.loadTypeNotifications();
    this.loadTotalUnread();
  }

  loadTotalUnread(){
    this.notificationService.getTotalUnread().subscribe({
      next: result => {
        this.totalNotifsNonLus = result;
      },
      error: error => {
        this.toastr.error("Erreur lors du chargement des totals non lues ");
      }
    })
  }

  loadNotifications() {
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications = data;
        this.filteredNotifications=data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Erreur lors du chargement des notifications ")
      }

    })
  }

  loadTypeNotifications() {
    this.typeNotificationService.getAll().subscribe((res) => {
      console.log(JSON.stringify(res));
      this.typeNotifications = res;
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/user.png';
  }

  toggleNotificationSidebar() {
    this.notificationSidebarOpen = !this.notificationSidebarOpen;
    this.notifToggle.emit(this.notificationSidebarOpen);
  }

  filterNotifications() {
    if (this.notificationFilter && this.notificationFilter.trim() !== "") {
      this.filteredNotifications = this.notifications.filter(
          (notif) => notif.typeNotification.id === this.notificationFilter
      );
    } else {
      this.filteredNotifications = [...this.notifications];
    }

    this.ref.detectChanges();
  }

  initSideBar() {
    const navbar: HTMLElement = this.element.nativeElement;
    const test = navbar.getElementsByClassName('navbar-toggler');
    this.toggleButton = test[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
      this.notificationSidebarOpen = false;
    });
  }

  navigate(lienApp: any) {
    this.openPopupPage(lienApp);
  }

  openPopupPage(url: any) {
    var tkn = "tkn";
    console.log(this.token);
    console.log(url + "/login?" + tkn + "=" + this.token);
    window.open(url + "/login?" + tkn + "=" + this.token, "_blank");
  }

  goToMessage() {
    this.navigate("http://192.168.6.80:9025/messagerie/index");
  }
  openMouvementDetail(mouvementId: string | undefined) {
    if(mouvementId){
      const modal = this.modal.open(MouvementDetailComponent, { size: 'lg', centered: true, backdrop: 'static' });
      modal.componentInstance.mouvementId = mouvementId;
    }

  }

  getUnreadMsg() {
    const requestUrl = `${environment.GRH}/msg/get-unread/${this.user?.matricule}`;
    this.httpClient.get(requestUrl).subscribe(
        (res: any) => {
          console.log(res);
          this.nb_message = res.response;
        }
    );
  }

  confirmLogout() {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      this.deconex();
    }
  }

  deconex() {
    this.account.logout();
  }

  getAgent() {
    let userInput: User = {
      matricule: this.account.getMatricule(),
    };
    this.account.getAgentActif(userInput).subscribe((res: any) => {
      this.user = res[0] as User;
      this.userImageUrl = this.user?.matricule ? `${this.FILE_STORAGE}/files/agent/${this.user.matricule}` : 'assets/img/user.png';
      this.getUnreadMsg();
      const u = new URL(environment.MERCURE_PUBLISH_URL);
      u.searchParams.append('topic', 'messagerieUnreadS01');
      u.searchParams.append('topic', 'messagerieNotifS01');
      this.es = new EventSource(u.href);
      this.es.onmessage = e => {
        var res = JSON.parse(e.data);
        if (res.message != undefined && res.message == this.user?.matricule) {
          this.nb_message = res.response;
          this.ref.detectChanges();
        }
        if (res.message != undefined && res.message == this.user?.matricule + 'NOTIF') {
          this.toastr.info(res.response);
          this.ref.detectChanges();
        }
      };
      this.account.setUser(this.user);
    });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }

  sidebarToggle() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName('html')[0];
    if (this.mobile_menu_visible == 1) {
      html.classList.remove('nav-open');
      var $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove('toggled');
      }, 400);
      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add('toggled');
      }, 430);
      var $layer: any = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');
      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }
      setTimeout(function () {
        $layer.classList.add('visible');
      }, 100);
      let mobile_menu_visible = this.mobile_menu_visible;
      $layer.onclick = function () {
        html.classList.remove('nav-open');
        mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);
      html.classList.add('nav-open');
      this.mobile_menu_visible = 1;
    }
  }
}