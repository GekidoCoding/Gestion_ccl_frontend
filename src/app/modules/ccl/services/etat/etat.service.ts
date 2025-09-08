import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Etat} from "../../model/etat/etat";
import {Page} from "../../interface/page.interface";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EtatService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/etat';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this.apiUrl}/`);
  }
  getEtatsFacture(): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this.apiUrl}/facture`);
  }
  getEtatAutre(): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this.apiUrl}/autre`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Etat>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Etat>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<Etat> {
    return this.http.get<Etat>(`${this.apiUrl}/${id}`);
  }
  getEtatProforma(): Observable<Etat> {
    return this.http.get<Etat>(`${this.apiUrl}/proforma`);
  }

  create(etat: Etat): Observable<Etat> {
    return this.http.post<Etat>(`${this.apiUrl}/create`, etat);
  }

  update(id: string, etat: Etat): Observable<Etat> {
    return this.http.put<Etat>(`${this.apiUrl}/update/${id}`, etat);
  }

  delete(id: string): Observable<Etat> {
    return this.http.delete<Etat>(`${this.apiUrl}/delete/${id}`);
  }
}