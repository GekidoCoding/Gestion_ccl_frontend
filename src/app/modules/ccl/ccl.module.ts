import { NgModule } from '@angular/core';
import { CommonModule, LOCATION_INITIALIZED, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgChartsModule } from 'ng2-charts';
import { CalendarDateFormatter, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CclRoutingModule } from './ccl-routing.module';
import { GeneralModule } from '../general/general.module';

import { LocalisationComponent } from './pages/localisation/localisation.component';
import { ClientComponent } from './pages/client/client.component';
import { EtatComponent } from './pages/etat/etat.component';
import { ModeleInfraComponent } from './pages/modele-infra/modele-infra.component';
import { CategorieInfraComponent } from './pages/categorie-infra/categorie-infra.component';
import { InfrastructureComponent } from './pages/infrastructure/infrastructure.component';
import { GestionnaireAddComponent } from './pages/gestionnaire-add/gestionnaire-add.component';
import { DetailInfrastructureComponent } from './components/infrastructure/detail-infrastructure/detail-infrastructure.component';
import { MouvementComponent } from './pages/mouvement/mouvement.component';
import { ClientAddFormComponent } from './components/client/client-add-form/client-add-form.component';
import { HistoriqueMvtComponent } from './components/historique/historique-mvt/historique-mvt.component';
import { HistoriqueMvtPopupComponent } from './components/historique/historique-mvt-popup/historique-mvt-popup.component';
import { ClientListPopupComponent } from './components/client/client-list-popup/client-list-popup.component';
import { ClientUpdateFormComponent } from './components/client/client-update-form/client-update-form.component';
import { InfrastructureListPopupComponent } from './components/infrastructure/infrastructure-list-popup/infrastructure-list-popup.component';
import { InfrastructureAddFormComponent } from './components/infrastructure/infrastructure-add-form/infrastructure-add-form.component';
import { MouvementAddComponent } from './components/mouvement/mouvement-add/mouvement-add.component';
import { MouvementDetailComponent } from './components/mouvement/mouvement-detail/mouvement-detail.component';
import { ClientDetailComponent } from './components/client/client-detail/client-detail.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FactureAddComponent } from './components/facture/facture-add/facture-add.component';
import { TestComponent } from './pages/test/test.component';
import { MouvementListPopupComponent } from './components/mouvement/mouvement-list-popup/mouvement-list-popup.component';
import { FactureListPopupComponent } from './components/facture/facture-list-popup/facture-list-popup.component';
import { FactureDetailComponent } from './components/facture/facture-detail/facture-detail.component';
import { HistoFactureListPopupComponent } from './components/historique/histo-facture/histo-facture-list-popup/histo-facture-list-popup.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { StatsComponent } from './pages/stats/stats/stats.component';
import { CustomDateFormatter } from './util/custom-date-formatter';
import { NotificationSidebarComponent } from './components/notification-sidebar/notification-sidebar.component';
import { PaiementPopupComponent } from './components/paiement/paiement-popup/paiement-popup.component';
import { PaiementAddComponent } from './components/paiement/paiement-add/paiement-add.component';
import { YesNoWarningComponent } from './components/yes-no-warning/yes-no-warning.component';
import { WarningPopupComponent } from './components/warning-popup/warning-popup.component';
import {
  InfraTarifListpopupComponent
} from "./components/infrastructure/infra-tarif-listpopup/infra-tarif-listpopup.component";
import {
  MouvementInfrasPopupComponent
} from "./components/mouvement/mouvement-infras-popup/mouvement-infras-popup.component";
import {FrequenceComponent} from "./pages/frequence/frequence/frequence.component";
import { TypeClientComponent } from './pages/type-client/type-client.component';
import { TypeClientAddComponent } from './components/type-client/type-client-add/type-client-add.component';
import { TypeClientUpdateComponent } from './components/type-client/type-client-update/type-client-update.component';
import { SendEmailFactureComponent } from './components/send-email-facture/send-email-facture.component';
import { ModeleInfraAddFormComponent } from './components/modele-infra/modele-infra-add-form/modele-infra-add-form.component';
import { ModeleInfraUpdateFormComponent } from './components/modele-infra/modele-infra-update-form/modele-infra-update-form.component';
import { MouvementVisualisationComponent } from './components/mouvement/mouvement-visualisation/mouvement-visualisation.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [

    LocalisationComponent,
    ClientComponent,
    EtatComponent,
    ModeleInfraComponent,
    CategorieInfraComponent,
    InfrastructureComponent,
    GestionnaireAddComponent,
    DetailInfrastructureComponent,
    MouvementComponent,
    ClientAddFormComponent,
    HistoriqueMvtComponent,
    HistoriqueMvtPopupComponent,
    ClientListPopupComponent,
    ClientUpdateFormComponent,
    InfrastructureListPopupComponent,
    InfrastructureAddFormComponent,
    MouvementAddComponent,
    InfraTarifListpopupComponent,
    MouvementDetailComponent,
    ClientDetailComponent,
    CalendarComponent,
    FactureAddComponent,
    TestComponent,
    MouvementListPopupComponent,
    FactureListPopupComponent,
    FactureDetailComponent,
    HistoFactureListPopupComponent,
    DashboardComponent,
    StatsComponent,
    NotificationSidebarComponent,
    PaiementPopupComponent,
    PaiementAddComponent,
    YesNoWarningComponent,
    WarningPopupComponent,
    MouvementInfrasPopupComponent,
    FrequenceComponent,
    TypeClientComponent,
    TypeClientAddComponent,
    TypeClientUpdateComponent,
    SendEmailFactureComponent,
    ModeleInfraAddFormComponent,
    ModeleInfraUpdateFormComponent,
    MouvementVisualisationComponent,
  ],
  imports: [
    CommonModule,
    CclRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    GeneralModule,
    MatOptionModule,
    NgChartsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    { provide: LOCATION_INITIALIZED, useValue: 'fr' },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter }
  ],
  exports: [
    NotificationSidebarComponent
  ]
})
export class CclModule { }


