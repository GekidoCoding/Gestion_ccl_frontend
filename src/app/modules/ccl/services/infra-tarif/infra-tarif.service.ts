import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {InfraTarif} from "../../model/infra-tarif/infra-tarif";

@Injectable({
  providedIn: 'root'
})
export class InfraTarifService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/infra_tarif';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Une erreur s\'est produite.'));
  }

  getAll(): Observable<InfraTarif[]> {
    return this.http.get<InfraTarif[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<InfraTarif>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<InfraTarif>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<InfraTarif> {
    return this.http.get<InfraTarif>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(activite: any): Observable<InfraTarif> {
    return this.http.post<InfraTarif>(`${this.apiUrl}/create`, activite).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, activite: InfraTarif): Observable<InfraTarif> {
    return this.http.put<InfraTarif>(`${this.apiUrl}/update/${id}`, activite).pipe(
        catchError(this.handleError)
    );
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}