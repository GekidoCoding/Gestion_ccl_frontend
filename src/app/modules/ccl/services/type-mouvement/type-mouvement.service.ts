import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {TypeMouvement} from "../../model/type-mouvement/type-mouvement";

@Injectable({
  providedIn: 'root'
})
export class TypeMouvementService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/type_mouvement';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<TypeMouvement[]> {
    return this.http.get<TypeMouvement[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<TypeMouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<TypeMouvement>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getById(id: string): Observable<TypeMouvement> {
    return this.http.get<TypeMouvement>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(etat: TypeMouvement): Observable<TypeMouvement> {
    return this.http.post<TypeMouvement>(`${this.apiUrl}/create`, etat).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, etat: TypeMouvement): Observable<TypeMouvement> {
    return this.http.put<TypeMouvement>(`${this.apiUrl}/update/${id}`, etat).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<TypeMouvement> {
    return this.http.delete<TypeMouvement>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}