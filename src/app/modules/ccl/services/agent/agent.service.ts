import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Agent} from "../../model/agent/agent";
import {Page} from "../../interface/page.interface";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/agent';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/`);
  }


  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Agent>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Agent>>(`${this.apiUrl}/paginated`, { params });
  }

  searchByCriteria(criteria: Agent): Observable<Agent[]> {
    let params = new HttpParams();

    if (criteria.matricule) params = params.set('matricule', criteria.matricule);
    if (criteria.nom) params = params.set('nom', criteria.nom);
    if (criteria.prenoms) params = params.set('prenoms', criteria.prenoms);
    if (criteria.mail) params = params.set('mail', criteria.mail);
    if (criteria.codeService) params = params.set('codeService', criteria.codeService);
    if (criteria.codeDirection) params = params.set('codeDirection', criteria.codeDirection);

    return this.http.get<Agent[]>(`${this.apiUrl}/criteria`, { params });
  }


}