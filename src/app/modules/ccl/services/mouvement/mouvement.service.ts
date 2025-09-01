import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Mouvement} from "../../model/mouvement/mouvement";
import {Facture} from "../../model/facture/facture";

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/mouvement';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/pagination/order`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  classerMouvement(id: string): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/classer/${id}`,null).pipe(
        catchError(this.handleError)
    );
  }
  accorderMouvement(id: string): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/accorder/${id}`,null).pipe(
        catchError(this.handleError)
    );
  }


  getByInfrastructure(idInfra:string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/infrastructure/${idInfra}`).pipe(
        catchError(this.handleError)
    );
  }
  getByInfrastructurePaginated(idInfra:string  ,page:number , pageSize:number): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/infrastructure/pagination/${idInfra}`, { params }).pipe(
        catchError(this.handleError)
    );
  }
  getByClientPaginated(idClient:string , page:number , pageSize:number): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/client/pagination/${idClient}`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getByClient(idclient:string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/client/${idclient}`).pipe(
        catchError(this.handleError)
    );
  }

  create( modeleInfra: Mouvement): Observable<Mouvement> {
    return this.http.post<Mouvement>(`${this.apiUrl}/create`, modeleInfra).pipe(
        catchError(this.handleError)
    );
  }

  update(id: string, mouvement: Mouvement): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/update/${id}`, mouvement).pipe(
        catchError(this.handleError)
    );
  }

  delete(id: string): Observable<Mouvement> {
    return this.http.delete<Mouvement>(`${this.apiUrl}/delete/${id}`).pipe(
        catchError(this.handleError)
    );
  }
  getCriteria(
      page: number = 0,
      pageSize: number = 10,
      criteria:Mouvement
  ): Observable<Page<Mouvement>> {
      let params = new HttpParams()
          .set('page', page.toString())
          .set('pageSize', pageSize.toString());
      if(criteria){
        if(criteria.typeMouvement.id){
          params = params.set('typeMouvementId', criteria.typeMouvement.id);
        }
        if(criteria.infrastructure.modeleInfra.catInfra.id){
          params = params.set('catInfraId', criteria.infrastructure.modeleInfra.catInfra.id);
        }
        if(criteria.periodeDebut){
          params = params.set('debut', criteria.periodeDebut);
        }
        if(criteria.periodeFin){
          params = params.set('fin', criteria.periodeFin);
        }
      }

      return this.http.get<Page<Mouvement>>(`${this.apiUrl}/search/criteria` , {params}).pipe(
          catchError(this.handleError)
      );
  }

  getCalendarData():Observable<Mouvement[]>{
    return this.http.get<Mouvement[]>(`${this.apiUrl}/calendar`).pipe(
        catchError(this.handleError)
    )
  }
  getCalendarDataByInfrastructureId(infrastructureId:string):Observable<Mouvement[]>{
    return this.http.get<Mouvement[]>(`${this.apiUrl}/calendar/${infrastructureId}`).pipe(
        catchError(this.handleError)
    )
  }
}