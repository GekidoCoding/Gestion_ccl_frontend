import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/config';

  constructor(private http: HttpClient) {}


  getReservationId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/type_reservation/id`, { responseType: 'text' });
  }

  getOccupationId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/type_occupation/id`, { responseType: 'text' });
  }

  getClassementId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/type_classement/id`, { responseType: 'text' });
  }

  getRenseignementId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/type_renseignement/id`, { responseType: 'text' });
  }

  getEtatCodeReelle(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/etat_code/reelle`);
  }

  getEtatCodePayee(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/etat_code/payee`);
  }


}