import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Facture} from "../../model/facture/facture";
import {Page} from "../../interface/page.interface";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/facture';

  constructor(private http: HttpClient) { }

  create(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/create`, facture);
  }
  udpate(id:string, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/update/${id}`, facture);
  }
  getRemise(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/config/remise`);
  }

  getById(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  getDefaultProforma(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/default/proforma/${id}`);
  }
  getByMouvementId(id: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/mouvement/${id}`);
  }

}