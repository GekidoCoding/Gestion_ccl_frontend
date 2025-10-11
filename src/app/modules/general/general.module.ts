import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import { LOCALE_ID } from '@angular/core';

// CCL pages moved to CclModule
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import { FloatingNavComponent } from './components/floating-nav/floating-nav.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    GeneralComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    FloatingNavComponent,
    LoadingComponent,
  ],
    imports: [
        CommonModule,
        GeneralRoutingModule,
        FormsModule,
        NgxSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatOptionModule,
        ReactiveFormsModule

    ],
  providers: [],
    exports: [LoadingComponent, FooterComponent, NavbarComponent, SidebarComponent, FloatingNavComponent ]
})
export class GeneralModule {}
