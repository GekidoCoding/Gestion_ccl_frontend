import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Agent} from "../../model/agent/agent";
import {Page} from "../../interface/page.interface";
import {Infrastructure} from "../../model/infrastructure/infrastructure";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/agent';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }


  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Agent>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Agent>>(`${this.apiUrl}/paginated`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  searchByCriteria(criteria: Agent): Observable<Agent[]> {
    let params = new HttpParams();

    if (criteria.matricule) params = params.set('matricule', criteria.matricule);
    if (criteria.nom) params = params.set('nom', criteria.nom);
    if (criteria.prenoms) params = params.set('prenoms', criteria.prenoms);
    if (criteria.mail) params = params.set('mail', criteria.mail);
    if (criteria.codeService) params = params.set('codeService', criteria.codeService);
    if (criteria.codeDirection) params = params.set('codeDirection', criteria.codeDirection);

    return this.http.get<Agent[]>(`${this.apiUrl}/criteria`, { params }).pipe(
        catchError(this.handleError)
    );
  }


}