import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {LocalisationComponent} from "../ccl/pages/localisation/localisation.component";
import { LOCALE_ID } from '@angular/core';

import {ClientComponent} from "../ccl/pages/client/client.component";
import { EtatComponent } from '../ccl/pages/etat/etat.component';
import { ModeleInfraComponent } from '../ccl/pages/modele-infra/modele-infra.component';
import { CategorieInfraComponent } from '../ccl/pages/categorie-infra/categorie-infra.component';
import { InfrastructureComponent } from '../ccl/pages/infrastructure/infrastructure.component';
import { GestionnaireAddComponent } from '../ccl/pages/gestionnaire-add/gestionnaire-add.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import { FloatingNavComponent } from './components/floating-nav/floating-nav.component';
import { DetailInfrastructureComponent } from '../ccl/components/application/detail-infrastructure/detail-infrastructure.component';
import {MouvementComponent} from "../ccl/pages/mouvement/mouvement.component";
import { ClientAddFormComponent } from '../ccl/components/application/client-add-form/client-add-form.component';
import { HistoriqueMvtComponent } from '../ccl/components/application/historique-mvt/historique-mvt.component';
import { HistoriqueMvtPopupComponent } from '../ccl/components/application/historique-mvt-popup/historique-mvt-popup.component';
import { ClientListPopupComponent } from '../ccl/components/application/client-list-popup/client-list-popup.component';
import { ClientUpdateFormComponent } from '../ccl/components/application/client-update-form/client-update-form.component';
import { InfrastructureListPopupComponent } from '../ccl/components/application/infrastructure-list-popup/infrastructure-list-popup.component';
import { InfrastructureAddFormComponent } from '../ccl/components/application/infrastructure-add-form/infrastructure-add-form.component';
import {MouvementAddComponent} from "../ccl/components/application/mouvement-add/mouvement-add.component";
import { MouvementDetailComponent } from '../ccl/components/application/mouvement-detail/mouvement-detail.component';
import { ClientDetailComponent } from '../ccl/components/application/client-detail/client-detail.component';
import { CalendarComponent } from '../ccl/pages/calendar/calendar.component';
import {CalendarDateFormatter, CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {CustomDateFormatter} from "../ccl/util/custom-date-formatter";
import { FactureAddComponent } from '../ccl/components/application/facture/facture-add/facture-add.component';
import { TestComponent } from '../ccl/pages/test/test.component';
import { MouvementListPopupComponent } from '../ccl/components/application/mouvement/mouvement-list-popup/mouvement-list-popup.component';
import { FactureListPopupComponent } from '../ccl/components/application/facture/facture-list-popup/facture-list-popup.component';
import { FactureDetailComponent } from '../ccl/components/application/facture/facture-detail/facture-detail.component';
import { HistoFactureListPopupComponent } from '../ccl/components/application/histo-facture/histo-facture-list-popup/histo-facture-list-popup.component';
import { DashboardComponent } from '../ccl/pages/dashboard/dashboard/dashboard.component';
import {NgChartsModule} from "ng2-charts";
import { StatsComponent } from '../ccl/pages/stats/stats/stats.component';
import { LoadingComponent } from '../ccl/components/application/loading/loading.component';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    GeneralComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LocalisationComponent,
    ClientComponent,
    EtatComponent,
    ModeleInfraComponent,
    CategorieInfraComponent,
    InfrastructureComponent,
    GestionnaireAddComponent,
    FloatingNavComponent,
    DetailInfrastructureComponent,
    MouvementComponent,
    ClientAddFormComponent,
    HistoriqueMvtComponent,
    HistoriqueMvtPopupComponent,
    ClientListPopupComponent,
    ClientUpdateFormComponent,
    ClientListPopupComponent,
    MouvementAddComponent,
    InfrastructureListPopupComponent,
    InfrastructureAddFormComponent,
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
    LoadingComponent
  ],
  imports: [
    CommonModule, GeneralRoutingModule, FormsModule, NgxSpinnerModule , MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule ,
    ReactiveFormsModule ,
    NgChartsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }) ,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' } ,
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter }
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class GeneralModule {}
