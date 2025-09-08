import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Client} from "../../model/client/client";
import {Page} from "../../interface/page.interface";
import {CategorieInfra} from "../../model/categorie-infra/categorie-infra";
import {environment} from "../../../../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/client';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Client>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Client>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update/${id}`, activite);
  }
  searchClients(criteria: any, infraIds: string[], page: number, pageSize: number): Observable<Page<Client>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());

    console.log('🔎 search criteria:', criteria);
    console.log('🔎 infraIds:', infraIds);

    if (criteria.nom) {
      params = params.set('nom', criteria.nom);
    }
    if (criteria.email) {
      params = params.set('email', criteria.email);
    }
    if (criteria.contacts) {
      params = params.set('contacts', criteria.contacts);
    }
    if (criteria.typeClient?.id) {
      params = params.set('typeClientId', criteria.typeClient.id);
    }
    if (criteria.contacts) {
      params = params.set('contacts', criteria.contacts);
    }

    infraIds.forEach(id => {
      params = params.append('infraIds', id);
    });

    console.log('🔎 final params:', params.toString());

    return this.http.get<Page<Client>>(
        `${this.apiUrl}/search/criteria?${params.toString()}`
    );
  }



  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getTotalPersonnes (id:string):Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${id}`);
  }

  getTotalMouvements(id:string):Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalMouvement/${id}`);
  }
}