import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general.component';

import {LocalisationComponent} from "../ccl/pages/localisation/localisation.component";
import {ClientComponent} from "../ccl/pages/client/client.component";
import {EtatComponent} from "../ccl/pages/etat/etat.component";
import {CategorieInfraComponent} from "../ccl/pages/categorie-infra/categorie-infra.component";
import {ModeleInfraComponent} from "../ccl/pages/modele-infra/modele-infra.component";
import {InfrastructureComponent} from "../ccl/pages/infrastructure/infrastructure.component";
import {GestionnaireAddComponent} from "../ccl/pages/gestionnaire-add/gestionnaire-add.component";
import {DetailInfrastructureComponent} from "../ccl/components/application/detail-infrastructure/detail-infrastructure.component";
import {MouvementComponent} from "../ccl/pages/mouvement/mouvement.component";
import {CalendarComponent} from "../ccl/pages/calendar/calendar.component";
import {TestComponent} from "../ccl/pages/test/test.component";
import {DashboardComponent} from "../ccl/pages/dashboard/dashboard/dashboard.component";
import {StatsComponent} from "../ccl/pages/stats/stats/stats.component";
import {FrequenceComponent} from "../ccl/pages/frequence/frequence/frequence.component";

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: '',
        redirectTo: 'client',
        pathMatch: 'full',
      },
      {
        path: 'localisation', // child route path
        component: LocalisationComponent, // child route component that the router renders
      },
      {
        path: 'frequence', // child route path
        component: FrequenceComponent, // child route component that the router renders
      },
      {
      path: 'categorie_infra', // child route path
        component: CategorieInfraComponent, // child route component that the router renders
      },

      {
        path: 'client', // child route path
        component: ClientComponent, // child route component that the router renders
      },
      {
        path: 'etat', // child route path
        component: EtatComponent, // child route component that the router renders
      },
      {
        path: 'modele_infra', // child route path
        component: ModeleInfraComponent, // child route component that the router renders
      },
      {
        path: 'infrastructure', // child route path
        component: InfrastructureComponent, // child route component that the router renders
      },
      {
        path: 'infrastructure/:id', // child route path
        component: DetailInfrastructureComponent, // child route component that the router renders
      },
      {
        path: 'mouvement/:type/:id', // child route path
        component: MouvementComponent, // child route component that the router renders
      },
      {
        path: 'gestionnaire', // child route path
        component: GestionnaireAddComponent, // child route component that the router renders
      },
      {
        path: 'mouvement', // child route path
        component: MouvementComponent, // child route component that the router renders
      },
      {
        path: 'calendar', // child route path
        component: CalendarComponent, // child route component that the router renders
      },
      {
        path: 'dashboard', // child route path
        component: DashboardComponent, // child route component that the router renders
      },

      { path: '**', redirectTo: 'client' },
    ],
  },
  { path: '**', redirectTo: 'documentation' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
