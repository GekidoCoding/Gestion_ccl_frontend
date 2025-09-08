import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {TypeMouvement} from "../../model/type-mouvement/type-mouvement";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TypeMouvementService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/type_mouvement';

  constructor(private http: HttpClient) { }


  getAll(): Observable<TypeMouvement[]> {
    return this.http.get<TypeMouvement[]>(`${this.apiUrl}/`);
  }
  getTrierAdding(): Observable<TypeMouvement[]> {
    return this.http.get<TypeMouvement[]>(`${this.apiUrl}/adding/trier`);
  }


  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<TypeMouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<TypeMouvement>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<TypeMouvement> {
    return this.http.get<TypeMouvement>(`${this.apiUrl}/${id}`);
  }
  getReservationId(): Observable<TypeMouvement> {
    return this.http.get<TypeMouvement>(`${this.apiUrl}/reservation/id`);
  }

  create(etat: TypeMouvement): Observable<TypeMouvement> {
    return this.http.post<TypeMouvement>(`${this.apiUrl}/create`, etat);
  }

  update(id: string, etat: TypeMouvement): Observable<TypeMouvement> {
    return this.http.put<TypeMouvement>(`${this.apiUrl}/update/${id}`, etat);
  }

  delete(id: string): Observable<TypeMouvement> {
    return this.http.delete<TypeMouvement>(`${this.apiUrl}/delete/${id}`);
  }
}