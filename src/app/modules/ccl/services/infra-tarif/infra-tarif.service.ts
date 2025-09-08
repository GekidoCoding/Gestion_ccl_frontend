import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {InfraTarif} from "../../model/infra-tarif/infra-tarif";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InfraTarifService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/infra_tarif';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InfraTarif[]> {
    return this.http.get<InfraTarif[]>(`${this.apiUrl}/`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<InfraTarif>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<InfraTarif>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<InfraTarif> {
    return this.http.get<InfraTarif>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<InfraTarif> {
    return this.http.post<InfraTarif>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: InfraTarif): Observable<InfraTarif> {
    return this.http.put<InfraTarif>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}