import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModeleInfra } from '../../model/modele-infra/modele-infra';
import {Page} from "../../interface/page.interface";

@Injectable({
  providedIn: 'root'
})
export class ModeleInfraService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/modele_infra';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<ModeleInfra[]> {
    return this.http.get<ModeleInfra[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<ModeleInfra>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<ModeleInfra>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getById(id: string): Observable<ModeleInfra> {
    return this.http.get<ModeleInfra>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create( modeleInfra: ModeleInfra): Observable<ModeleInfra> {
    return this.http.post<ModeleInfra>(`${this.apiUrl}/create`, modeleInfra).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, modeleInfra: ModeleInfra): Observable<ModeleInfra> {
    return this.http.put<ModeleInfra>(`${this.apiUrl}/update/${id}`, modeleInfra).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<ModeleInfra> {
    return this.http.delete<ModeleInfra>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}