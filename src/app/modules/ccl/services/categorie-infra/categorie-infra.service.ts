import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import {Page} from "../../interface/page.interface";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategorieInfraService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/categorie_infra';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategorieInfra[]> {
    return this.http.get<CategorieInfra[]>(`${this.apiUrl}/`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<CategorieInfra>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<CategorieInfra>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<CategorieInfra> {
    return this.http.get<CategorieInfra>(`${this.apiUrl}/${id}`);
  }

  create(categorieInfra: CategorieInfra): Observable<CategorieInfra> {
    return this.http.post<CategorieInfra>(`${this.apiUrl}/create`, categorieInfra);
  }

  update(id: string, categorieInfra: CategorieInfra): Observable<CategorieInfra> {
    return this.http.put<CategorieInfra>(`${this.apiUrl}/update/${id}`, categorieInfra);
  }

  delete(id: string): Observable<CategorieInfra> {
    return this.http.delete<CategorieInfra>(`${this.apiUrl}/delete/${id}`);
  }
}