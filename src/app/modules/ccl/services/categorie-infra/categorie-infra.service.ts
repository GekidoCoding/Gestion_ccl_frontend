import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import {Page} from "../../interface/page.interface";

@Injectable({
  providedIn: 'root'
})
export class CategorieInfraService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/categorie_infra';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<CategorieInfra[]> {
    return this.http.get<CategorieInfra[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<CategorieInfra>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<CategorieInfra>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<CategorieInfra> {
    return this.http.get<CategorieInfra>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(categorieInfra: CategorieInfra): Observable<CategorieInfra> {
    return this.http.post<CategorieInfra>(`${this.apiUrl}/create`, categorieInfra).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, categorieInfra: CategorieInfra): Observable<CategorieInfra> {
    return this.http.put<CategorieInfra>(`${this.apiUrl}/update/${id}`, categorieInfra).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<CategorieInfra> {
    return this.http.delete<CategorieInfra>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}