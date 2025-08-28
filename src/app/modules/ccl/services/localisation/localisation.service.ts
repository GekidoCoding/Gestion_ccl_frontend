import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Localisation} from "../../model/localisation/localisation";
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/localisation';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Une erreur s\'est produite.'));
  }

  getAll(): Observable<Localisation[]> {
    return this.http.get<Localisation[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Localisation>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Localisation>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<Localisation> {
    return this.http.get<Localisation>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(activite: any): Observable<Localisation> {
    return this.http.post<Localisation>(`${this.apiUrl}/create`, activite).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, activite: Localisation): Observable<Localisation> {
    return this.http.put<Localisation>(`${this.apiUrl}/update/${id}`, activite).pipe(
        catchError(this.handleError)
    );
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}