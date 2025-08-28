import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Etat} from "../../model/etat/etat";
import {Page} from "../../interface/page.interface";

@Injectable({
  providedIn: 'root'
})
export class EtatService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/etat';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Etat>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Etat>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<Etat> {
    return this.http.get<Etat>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(etat: Etat): Observable<Etat> {
    return this.http.post<Etat>(`${this.apiUrl}/create`, etat).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, etat: Etat): Observable<Etat> {
    return this.http.put<Etat>(`${this.apiUrl}/update/${id}`, etat).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<Etat> {
    return this.http.delete<Etat>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}