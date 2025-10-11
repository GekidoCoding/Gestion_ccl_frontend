import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { User } from '../model/user';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AppGuard implements CanActivate {
  constructor(private router: Router, private account: AccountService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let data = sessionStorage.getItem('user');
    if (data != null) {

      return true;
    } else {
      if (
        route.queryParams.tkn &&
        this.account.decodeUserInfo(route.queryParams.tkn) != null
      ) {

        this.account.getNewAccessToken(route.queryParams.tkn).subscribe(
          (res: any) => {
            sessionStorage.setItem('user', res.user.token);

            let userInput: User = {
              matricule: this.account.getMatricule(),
            };
            this.account.setFirstLogin(true);
            this.account.getAgentActif(userInput).subscribe(
              (res: any) => {
                this.account.setFirstLogin(true);

                this.account.setUser(res[0]);

                let routeTogo = '';
                let routeURL = state.url.split('?')[0].split('/');
                routeURL.splice(0, 1);

                for (let i = 0; i < routeURL.length; i++) {
                  if (i == 0) routeTogo += routeURL[i];
                  else routeTogo += '/' + routeURL[i];
                }
                this.router.navigate([routeTogo]);

                return true;
              },
              () => {
                this.account.logout();
              }
            );
          },
          () => {
            this.account.logout();
          }
        );
      } else {
        this.account.logout();
      }
    }
    return false;
  }
}
