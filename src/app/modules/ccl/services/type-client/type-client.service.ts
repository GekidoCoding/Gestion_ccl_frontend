import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {TypeClient} from "../../model/type-client/type-client";

@Injectable({
  providedIn: 'root'
})
export class TypeClientService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/type_client';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Une erreur s\'est produite.'));
  }

  getAll(): Observable<TypeClient[]> {
    return this.http.get<TypeClient[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<TypeClient>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<TypeClient>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<TypeClient> {
    return this.http.get<TypeClient>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(activite: any): Observable<TypeClient> {
    return this.http.post<TypeClient>(`${this.apiUrl}/create`, activite).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, activite: TypeClient): Observable<TypeClient> {
    return this.http.put<TypeClient>(`${this.apiUrl}/update/${id}`, activite).pipe(
        catchError(this.handleError)
    );
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
  getPersonneId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/personne/id`, {
      responseType: 'text'
    }).pipe(
        catchError(this.handleError)
    );
  }

}