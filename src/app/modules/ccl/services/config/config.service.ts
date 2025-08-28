import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/config';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Une erreur s\'est produite.'));
  }

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


}