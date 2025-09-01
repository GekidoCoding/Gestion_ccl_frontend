import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GeneralModule } from './modules/general/general.module';
import { ToastrModule } from 'ngx-toastr';
import { ApiInterceptor } from './modules/general/interceptors/api.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FrequenceComponent } from './modules/ccl/pages/frequence/frequence/frequence.component';
import {FormsModule} from "@angular/forms";
import { InfraTarifListpopupComponent } from './modules/ccl/components/application/infra-tarif-listpopup/infra-tarif-listpopup.component';
import { MouvementInfrasPopupComponent } from './modules/ccl/components/application/mouvement-infras-popup/mouvement-infras-popup/mouvement-infras-popup.component';


@NgModule({
  declarations: [AppComponent, FrequenceComponent, InfraTarifListpopupComponent, MouvementInfrasPopupComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        GeneralModule,
        NgxSpinnerModule,

        ToastrModule.forRoot({
            timeOut: 7000,
            closeButton: true,
            enableHtml: true,
            toastClass: 'alert',
            positionClass: 'toast-bottom-right',
        }),
        FormsModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
