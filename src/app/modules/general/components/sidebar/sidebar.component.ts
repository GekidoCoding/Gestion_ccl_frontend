import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  subItems?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Géstion des Entités',
    icon: 'fas fa-tag',
    class: '',
    subItems: [
      {
        path: '/general/localisation',
        title: 'Localisation',
        icon: 'fas fa-map-marker-alt',
        class: ''
      },
      {
        path: '/general/categorie_infra',
        title: 'Categorie',
        icon: 'far fa-folder',
        class: ''
      },
      {
        path: '/general/modele_infra',
        title: 'Modele',
        icon: 'far fa-object-group',
        class: ''
      }
    ]
  },
  {
    path: '/general/client',
    title: 'Client',
    icon: 'far fa-user-circle',
    class: ''
  },
  {
    path: '/general/infrastructure',
    title: 'Infrastructure',
    icon: 'far fa-building',
    class: ''
  },
  {
    path: '/general/mouvement',
    title: 'Mouvement',
    icon: 'fas fa-exchange-alt',
    class: ''
  },

  {
    path: '/general/calendar',
    title: 'Calendrier',
    icon: 'far fa-calendar',
    class: ''
  },

  {
    path: '/general/dashboard',
    title: 'Statistique',
    icon: 'far fa-chart-bar',
    class: ''
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];
  config: any;
  expandedItems: { [key: string]: boolean } = {};

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    const headers = new HttpHeaders()
        .set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache');

    this.httpClient
        .get<any>('/assets/config.json', { headers })
        .subscribe((config) => {
          this.config = config;
        });

    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  toggleSubMenu(title: string): void {
    this.expandedItems[title] = !this.expandedItems[title];
  }

  isExpanded(title: string): boolean {
    return !!this.expandedItems[title];
  }

  hasSubItems(item: RouteInfo): boolean {
    return !!(item.subItems && item.subItems.length > 0);
  }
}