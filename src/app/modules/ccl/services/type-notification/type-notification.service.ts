import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {TypeNotification} from "../../model/type-notification/type-notification";
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TypeNotificationService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/type_notification';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeNotification[]> {
    return this.http.get<TypeNotification[]>(`${this.apiUrl}/`);
  }
  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<TypeNotification>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<TypeNotification>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<TypeNotification> {
    return this.http.get<TypeNotification>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<TypeNotification> {
    return this.http.post<TypeNotification>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: TypeNotification): Observable<TypeNotification> {
    return this.http.put<TypeNotification>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}