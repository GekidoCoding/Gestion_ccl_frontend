import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Frequence } from '../../model/frequence/frequence';
import { Page } from '../../interface/page.interface';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FrequenceService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/frequence';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Frequence[]> {
    return this.http.get<Frequence[]>(`${this.apiUrl}/`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Frequence>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Frequence>>(`${this.apiUrl}/pagination`, { params });
  }

  getById(id: string): Observable<Frequence> {
    return this.http.get<Frequence>(`${this.apiUrl}/${id}`);
  }

  create(frequence: Frequence): Observable<Frequence> {
    return this.http.post<Frequence>(`${this.apiUrl}/create`, frequence);
  }

  update(id: string, frequence: Frequence): Observable<Frequence> {
    return this.http.put<Frequence>(`${this.apiUrl}/update/${id}`, frequence);
  }

  delete(id: string): Observable<Frequence> {
    return this.http.delete<Frequence>(`${this.apiUrl}/delete/${id}`);
  }

  findDefaultFrequence(): Observable<Frequence> {
    return this.http.get<Frequence>(`${this.apiUrl}/defaut`);
  }
}