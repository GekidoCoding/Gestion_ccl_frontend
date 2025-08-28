import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Admin} from "../../model/admin/admin";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/admin';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  create(categorieInfra: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/create`, categorieInfra).pipe(
        catchError(this.handleError)
    );
  }


  delete(id: string): Observable<Admin> {
    return this.http.delete<Admin>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}