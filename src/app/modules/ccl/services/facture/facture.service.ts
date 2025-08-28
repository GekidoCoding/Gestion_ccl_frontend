import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Facture} from "../../model/facture/facture";
import {Page} from "../../interface/page.interface";
import {Infrastructure} from "../../model/infrastructure/infrastructure";

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/facture';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  create(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/create`, facture).pipe(
        catchError(this.handleError)
    );
  }
  udpate(id:string, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/update/${id}`, facture).pipe(
        catchError(this.handleError)
    );
  }
  getRemise(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/config/remise`).pipe(
        catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }
  getByMouvementId(id: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/mouvement/${id}`).pipe(
        catchError(this.handleError)
    )
  }

}