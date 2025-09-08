import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Mouvement} from "../../model/mouvement/mouvement";
import {Facture} from "../../model/facture/facture";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/mouvement';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.apiUrl}/`);
  }

  getPaginated(page: number = 0, pageSize: number = 10): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/pagination/order`, { params });
  }

  getById(id: string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/${id}`);
  }

  classerMouvement(id: string): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/classer/${id}`,null);
  }
  accorderMouvement(id: string): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/accorder/${id}`,null);
  }

  getConflictMouvement(mouvement:Mouvement): Observable<Mouvement[]> {
    return this.http.post<Mouvement[]>(`${this.apiUrl}/verify/conflict`,mouvement);
  }

  getByInfrastructure(idInfra:string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/infrastructure/${idInfra}`);
  }
  getByInfrastructurePaginated(idInfra:string  ,page:number , pageSize:number): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/infrastructure/pagination/${idInfra}`, { params });
  }
  getByClientPaginated(idClient:string , page:number , pageSize:number): Observable<Page<Mouvement>> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    return this.http.get<Page<Mouvement>>(`${this.apiUrl}/client/pagination/${idClient}`, { params });
  }

  getByClient(idclient:string): Observable<Mouvement> {
    return this.http.get<Mouvement>(`${this.apiUrl}/client/${idclient}`);
  }

  create( modeleInfra: Mouvement): Observable<Mouvement> {
    return this.http.post<Mouvement>(`${this.apiUrl}/create`, modeleInfra);
  }
  update(id: string, mouvement: Mouvement): Observable<Mouvement> {
    return this.http.put<Mouvement>(`${this.apiUrl}/update/${id}`, mouvement).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating mouvement:', error);

          let errorMsg = 'Erreur inconnue';
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Erreur client: ${error.error.message}`;
          } else {
            errorMsg = `Erreur serveur: ${error.status} - ${error.message}`;
          }

          return throwError(() => new Error(errorMsg));
        })
    );
  }

  delete(id: string): Observable<Mouvement> {
    return this.http.delete<Mouvement>(`${this.apiUrl}/delete/${id}`);
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

      return this.http.get<Page<Mouvement>>(`${this.apiUrl}/search/criteria` , {params});
  }

  getCalendarData():Observable<Mouvement[]>{
    return this.http.get<Mouvement[]>(`${this.apiUrl}/calendar`);
  }
  getCalendarDataByInfrastructureId(infrastructureId:string):Observable<Mouvement[]>{
    return this.http.get<Mouvement[]>(`${this.apiUrl}/calendar/${infrastructureId}`);
  }
  getCalendarDataByCriteria(infrastructureId:string , modelesIds:string[]):Observable<Mouvement[]>{
    let params = new HttpParams();
    if(infrastructureId){
      params =params.set('infrastructureId', infrastructureId);
    }
    if (modelesIds && modelesIds.length > 0) {
      modelesIds.forEach(id => {
        params = params.append('modelesIds', id);
      });
    }


    return this.http.get<Mouvement[]>(`${this.apiUrl}/calendar/criteria` , {params}  );
  }
}