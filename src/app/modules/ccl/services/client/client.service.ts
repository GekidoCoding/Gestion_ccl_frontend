import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Client} from "../../model/client/client";
import {Page} from "../../interface/page.interface";
import {CategorieInfra} from "../../model/categorie-infra/categorie-infra";
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/client';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Une erreur s\'est produite.'));
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Client>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Client>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(activite: any): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/create`, activite).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, activite: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update/${id}`, activite).pipe(
        catchError(this.handleError)
    );
  }
  searchClients(criteria: any, infraIds: string[], page: number, pageSize: number): Observable<Page<Client>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('nom', criteria.nom || '')
        .set('email', criteria.email || '')
        .set('contacts', criteria.contacts || '')
        .set('typeClientId', criteria.typeClient?.id || '');

    infraIds.forEach(id => {
      params = params.append('infraIds', id);
    });

    return this.http.get<Page<Client>>(
        `${this.apiUrl}/search/criteria`,
        { params }
    ).pipe(
        catchError(this.handleError)
    );
  }


  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  getTotalPersonnes (id:string):Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}