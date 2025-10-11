import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from './modules/general/guard/app.guard';
import {environment} from "../environments/environment";
import {AppComponent} from "./app.component";
const routes: Routes = [

  {
    path: '',
    canActivate:[AppGuard],
    redirectTo: 'mouvement',
    pathMatch: 'full',
  },
  {
    path: environment.PREFIX,
    canActivate: [AppGuard],
    loadChildren: () =>
      import('./modules/ccl/ccl.module').then((m) => m.CclModule),
  },
  {
    path: 'general',
    canActivate: [AppGuard],
    loadChildren: () =>
        import('./modules/general/general.module').then((m) => m.GeneralModule),
  },
  { path: '**', redirectTo: environment.PREFIX },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
