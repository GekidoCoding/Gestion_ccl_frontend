import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, Subscription, throwError } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor, OnDestroy {
  private userSubscription: Subscription | null = null;

  constructor(private account: AccountService) {
    console.log('[ApiInterceptor] Constructeur appelé');
    this.userSubscription = this.account.user.subscribe((res) => {
      console.log('[ApiInterceptor] Nouvelle valeur user reçue :', res);
      if (res != null) {
        this.user = res;
      }
    });
  }

  ngOnDestroy(): void {
    console.log('[ApiInterceptor] ngOnDestroy → désabonnement');
    this.userSubscription?.unsubscribe();
  }

  user: User | null = null;

  intercept(
      request: HttpRequest<any>,
      next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[ApiInterceptor] Interception de la requête :', request.url);

    if (!request.url.includes('access-token')) {
      console.log('[ApiInterceptor] Ajout des headers Authorization et utilisateur');
      request = request.clone({
        headers: request.headers
            .set('Authorization', `Bearer ${this.account.getToken()}`)
            .set('utilisateur', this.user ? this.user.matricule : ''),
      });

      console.log('[ApiInterceptor] Requête clonée avec headers :', request.headers);

      return next.handle(request).pipe<any>(
          catchError((err: HttpErrorResponse) => {
            console.error('[ApiInterceptor] Erreur interceptée :', err);

            if (err.status === 401) {
              console.warn('[ApiInterceptor] 401 détecté → Déconnexion');
              // this.account.logout();
              return throwError(err);
            }

            console.log('[ApiInterceptor] Erreur non 401 → propagation');
            return next.handle(request);
          })
      );
    } else {
      console.log('[ApiInterceptor] Requête access-token détectée, pas de modification');
      return next.handle(request);
    }
  }
}
