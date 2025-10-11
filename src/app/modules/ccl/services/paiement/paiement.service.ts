import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Page} from "../../interface/page.interface";
import {environment} from "../../../../../environments/environment";
import {Paiement} from "../../model/paiement/paiement";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/paiement';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/`);
  }
  getByFactureId(factureId:string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/facture/${factureId}`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Paiement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Paiement>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  create(activite: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}