import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {Page} from "../../interface/page.interface";

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/infrastructure';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Infrastructure[]> {
    return this.http.get<Infrastructure[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Infrastructure>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Infrastructure>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Infrastructure> {
    return this.http.get<Infrastructure>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(infrastructure: Infrastructure): Observable<Infrastructure> {
    return this.http.post<Infrastructure>(`${this.apiUrl}/create`, infrastructure).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, infrastructure: Infrastructure): Observable<Infrastructure> {
    return this.http.put<Infrastructure>(`${this.apiUrl}/update/${id}`, infrastructure).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<Infrastructure> {
    return this.http.delete<Infrastructure>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  deleteWithObservation(id: string ,  observation:string): Observable<Infrastructure> {
    return this.http.delete<Infrastructure>(`${this.apiUrl}/delete/observation/${id}/${observation}`).pipe(
        catchError(this.handleError)
    );
  }

  searchInfrastructures(
      page: number = 0,
      pageSize: number = 10,
      nom?: string,
      numero?: string,
      localisationIds?: string[],
      modeleIds?: string[],
      categorieInfraId?: string,
      debut?: string,
      fin?: string
  ): Observable<Page<Infrastructure>> {

    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());

    if (nom) {
      params = params.set('nom', nom);
    }

    if (numero) {
      params = params.set('numero', numero);
    }

    if (localisationIds && localisationIds.length > 0) {
      localisationIds.forEach(id => {
        params = params.append('localisationIds', id);
      });
    }

    if (modeleIds && modeleIds.length > 0) {
      modeleIds.forEach(id => {
        params = params.append('modeleIds', id);
      });
    }

    if (categorieInfraId) {
      params = params.set('categorieInfraId', categorieInfraId);
    }

    if (debut) {
      params = params.set('debut', debut);
    }

    if (fin) {
      params = params.set('fin', fin);
    }

    return this.http.get<Page<Infrastructure>>(`${this.apiUrl}/search/criteria`, { params });
  }
}