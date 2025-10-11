import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Page} from "../../interface/page.interface";
import {environment} from "../../../../../environments/environment";
import {ModePaiement} from "../../model/mode-paiement/mode-paiement";

@Injectable({
  providedIn: 'root'
})
export class ModePaiementService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/mode_paiement';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ModePaiement[]> {
    return this.http.get<ModePaiement[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<ModePaiement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<ModePaiement>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<ModePaiement> {
    return this.http.get<ModePaiement>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<ModePaiement> {
    return this.http.post<ModePaiement>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: ModePaiement): Observable<ModePaiement> {
    return this.http.put<ModePaiement>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}