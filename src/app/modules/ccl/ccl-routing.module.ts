import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from '../general/general.component';

import { LocalisationComponent } from './pages/localisation/localisation.component';
import { ClientComponent } from './pages/client/client.component';
import { EtatComponent } from './pages/etat/etat.component';
import { CategorieInfraComponent } from './pages/categorie-infra/categorie-infra.component';
import { ModeleInfraComponent } from './pages/modele-infra/modele-infra.component';
import { InfrastructureComponent } from './pages/infrastructure/infrastructure.component';
import { GestionnaireAddComponent } from './pages/gestionnaire-add/gestionnaire-add.component';
import { DetailInfrastructureComponent } from './components/infrastructure/detail-infrastructure/detail-infrastructure.component';
import { MouvementComponent } from './pages/mouvement/mouvement.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { TestComponent } from './pages/test/test.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { StatsComponent } from './pages/stats/stats/stats.component';
import { FrequenceComponent } from './pages/frequence/frequence/frequence.component';
import {TypeClientComponent} from "./pages/type-client/type-client.component";

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      { path: '', redirectTo: 'mouvement', pathMatch: 'full' },
      { path: 'localisation', component: LocalisationComponent },
      { path: 'frequence', component: FrequenceComponent },
      { path: 'categorie_infra', component: CategorieInfraComponent },
      { path: 'client', component: ClientComponent },
      { path: 'etat', component: EtatComponent },
      { path: 'modele_infra', component: ModeleInfraComponent },
      { path: 'infrastructure', component: InfrastructureComponent },
      { path: 'infrastructure/:id', component: DetailInfrastructureComponent },
      { path: 'mouvement/:type/:id', component: MouvementComponent },
      { path: 'gestionnaire', component: GestionnaireAddComponent },
      { path: 'mouvement', component: MouvementComponent },
      { path: 'type_client', component: TypeClientComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'test', component: TestComponent },
      { path: '**', redirectTo: 'mouvement' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CclRoutingModule {}


