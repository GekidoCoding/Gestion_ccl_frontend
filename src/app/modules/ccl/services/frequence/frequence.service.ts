import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Frequence } from '../../model/frequence/frequence';
import { Page } from '../../interface/page.interface';

@Injectable({
  providedIn: 'root'
})
export class FrequenceService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/frequence';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Error in Frequence API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Frequence[]> {
    return this.http.get<Frequence[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Frequence>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Frequence>>(`${this.apiUrl}/pagination`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Frequence> {
    return this.http.get<Frequence>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  create(frequence: Frequence): Observable<Frequence> {
    return this.http.post<Frequence>(`${this.apiUrl}/create`, frequence).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, frequence: Frequence): Observable<Frequence> {
    return this.http.put<Frequence>(`${this.apiUrl}/update/${id}`, frequence).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<Frequence> {
    return this.http.delete<Frequence>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
}