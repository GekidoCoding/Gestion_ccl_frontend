import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Localisation} from "../../model/localisation/localisation";
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/localisation';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Localisation[]> {
    return this.http.get<Localisation[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Localisation>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Localisation>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<Localisation> {
    return this.http.get<Localisation>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<Localisation> {
    return this.http.post<Localisation>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: Localisation): Observable<Localisation> {
    return this.http.put<Localisation>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}