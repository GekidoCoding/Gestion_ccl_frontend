import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModeleInfra } from '../../model/modele-infra/modele-infra';
import {Page} from "../../interface/page.interface";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ModeleInfraService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/modele_infra';

  constructor(private http: HttpClient) { }


  getAll(): Observable<ModeleInfra[]> {
    return this.http.get<ModeleInfra[]>(`${this.apiUrl}/`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<ModeleInfra>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<ModeleInfra>>(`${this.apiUrl}/pagination`, { params });
  }

  getById(id: string): Observable<ModeleInfra> {
    return this.http.get<ModeleInfra>(`${this.apiUrl}/${id}`);
  }

  create( modeleInfra: ModeleInfra): Observable<ModeleInfra> {
    return this.http.post<ModeleInfra>(`${this.apiUrl}/create`, modeleInfra);
  }

  update(id: string, modeleInfra: ModeleInfra): Observable<ModeleInfra> {
    return this.http.put<ModeleInfra>(`${this.apiUrl}/update/${id}`, modeleInfra);
  }

  delete(id: string): Observable<ModeleInfra> {
    return this.http.delete<ModeleInfra>(`${this.apiUrl}/delete/${id}`);
  }
}