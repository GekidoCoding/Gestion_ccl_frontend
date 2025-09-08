import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {Gestionnaire} from "../../model/gestionnaire/gestionnaire";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GestionnaireService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/gestionnaire';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Gestionnaire[]> {
    return this.http.get<Gestionnaire[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Gestionnaire>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Gestionnaire>>(`${this.apiUrl}/pagination`, { params });
  }

  getById(id: string): Observable<Gestionnaire> {
    return this.http.get<Gestionnaire>(`${this.apiUrl}/${id}`);
  }

  create(gestionnaire: Gestionnaire): Observable<Gestionnaire> {
    return this.http.post<Gestionnaire>(`${this.apiUrl}/create`, gestionnaire);
  }

  update(id: string, gestionnaire: Gestionnaire): Observable<Gestionnaire> {
    return this.http.put<Gestionnaire>(`${this.apiUrl}/update/${id}`, gestionnaire);
  }

  delete(id: string): Observable<Gestionnaire> {
    return this.http.delete<Gestionnaire>(`${this.apiUrl}/delete/${id}`);
  }
}