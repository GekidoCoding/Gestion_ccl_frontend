import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.PRINCIPAL + environment.PREFIX + '/dashboard';

  constructor(private http: HttpClient) { }

  getTotalDashboard(
      date1?: string,
      date2?: string,
      year?: number,
      categorieInfraId?: string,
      typeMouvementId?: string,
      modelesIds?: string[]
  ): Observable<number[]> {
    let params = this.buildParams(date1, date2, year, categorieInfraId, typeMouvementId, modelesIds);
    return this.http.get<number[]>(`${this.apiUrl}/total`, { params });
  }

  getPourcentageDashboard(
      date1?: string,
      date2?: string,
      year?: number,
      categorieInfraId?: string,
      typeMouvementId?: string,
      modelesIds?: string[]
  ): Observable<number[]> {
    let params = this.buildParams(date1, date2, year, categorieInfraId, typeMouvementId, modelesIds);
    return this.http.get<number[]>(`${this.apiUrl}/pourcentage`, { params });
  }

  getMonthlyData(
      date1?: string,
      date2?: string,
      year?: number,
      categorieInfraId?: string,
      typeMouvementId?: string,
      modelesIds?: string[]
  ): Observable<number[][]> {
    let params = this.buildParams(date1, date2, year, categorieInfraId, typeMouvementId, modelesIds);
    return this.http.get<number[][]>(`${this.apiUrl}/lineChart`, { params });
  }

  /**
   * Construit dynamiquement les query params
   */
  private buildParams(
      date1?: string,
      date2?: string,
      year?: number,
      categorieInfraId?: string,
      typeMouvementId?: string,
      modelesIds?: string[]
  ): HttpParams {
    let params = new HttpParams();

    if (date1) params = params.set('date1', date1);
    if (date2) params = params.set('date2', date2);
    if (year !== undefined) params = params.set('year', year.toString());
    if (categorieInfraId) params = params.set('categorieInfraId', categorieInfraId);
    if (typeMouvementId) params = params.set('typeMouvementId', typeMouvementId);

    if (modelesIds && modelesIds.length > 0) {
      modelesIds.forEach(id => {
        params = params.append('modelesIds', id); // ⚡ append pour conserver plusieurs valeurs
      });
    }

    return params;
  }
}
