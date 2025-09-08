import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {TypeClient} from "../../model/type-client/type-client";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TypeClientService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/type_client';

  constructor(private http: HttpClient) {}


  getAll(): Observable<TypeClient[]> {
    return this.http.get<TypeClient[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<TypeClient>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<TypeClient>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<TypeClient> {
    return this.http.get<TypeClient>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<TypeClient> {
    return this.http.post<TypeClient>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: TypeClient): Observable<TypeClient> {
    return this.http.put<TypeClient>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  getPersonneId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/personne/id`, {
      responseType: 'text'
    });
  }

}