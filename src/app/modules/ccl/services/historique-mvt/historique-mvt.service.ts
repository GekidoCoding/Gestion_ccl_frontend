import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {HistoriqueMvt} from "../../model/historique-mvt/historique-mvt";

@Injectable({
  providedIn: 'root'
})
export class HistoriqueMvtService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/historique_mvt';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getByIdMvt(id:string): Observable<HistoriqueMvt[]> {
    return this.http.get<HistoriqueMvt[]>(`${this.apiUrl}/mouvement/${id}`).pipe(
        catchError(this.handleError)
    );
  }

  getHistoriqueMvtsCriteria(date1?: string, date2?: string, year?: number , categorieInfraId?:string , typeMouvementId?:string): Observable<HistoriqueMvt[]> {
    let params = new HttpParams();

    if (date1) {
      params = params.set('date1', date1);
    }
    if (date2) {
      params = params.set('date2', date2);
    }
    if (categorieInfraId) {
      params = params.set('categorieInfraId', categorieInfraId);
    }
    if (typeMouvementId) {
      params = params.set('typeMouvementId', typeMouvementId);
    }
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<HistoriqueMvt[]>(`${this.apiUrl}/mouvement/dashboard`, { params }).pipe(
        catchError(this.handleError)
    );
  }


}