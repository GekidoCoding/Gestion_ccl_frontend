import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Notification} from "../../model/notification/notification";
import {Page} from "../../interface/page.interface";
import {Etat} from "../../model/etat/etat";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/notification';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/`);
  }

  getUnread(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }
  markAsRead(id: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/mark_as_read/${id}`,'');
  }
  markAllread(){
    return this.http.post<Notification>(`${this.apiUrl}/mark_all_as_read`,'');
  }

  getTotalUnread(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/total`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Notification>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Notification>>(`${this.apiUrl}/pagination`, { params });
  }
  getById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  create(activite: any): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/create`, activite);
  }

  update(id: string, activite: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/update/${id}`, activite);
  }

  delete (id:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}