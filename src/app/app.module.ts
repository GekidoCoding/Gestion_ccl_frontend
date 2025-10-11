import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ApiInterceptor } from './modules/general/interceptors/api.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FormsModule} from "@angular/forms";
import { GeneralModule } from './modules/general/general.module';


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        GeneralModule,
        ToastrModule.forRoot({
            timeOut: 7000,
            closeButton: true,
            enableHtml: true,
            toastClass: 'alert',
            positionClass: 'toast-bottom-right',
        }),
        FormsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule { }
