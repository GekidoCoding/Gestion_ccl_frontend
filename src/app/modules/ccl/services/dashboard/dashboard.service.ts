import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Direction} from "../../model/direction/direction";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/dashboard';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getTotalDashboard(date1?: string, date2?: string, year?: number): Observable<number[]> {
    let params = new HttpParams();

    if (date1) {
      params = params.set('date1', date1);
    }
    if (date2) {
      params = params.set('date2', date2);
    }
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<number[]>(`${this.apiUrl}/total`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getPourcentageDashboard(date1?: string, date2?: string, year?: number): Observable<number[]> {
    let params = new HttpParams();

    if (date1) {
      params = params.set('date1', date1);
    }
    if (date2) {
      params = params.set('date2', date2);
    }
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<number[]>(`${this.apiUrl}/pourcentage`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  getMonthlyData(date1?: string, date2?: string, year?: number): Observable<number[][]> {
    let params = new HttpParams();

    if (date1) {
      params = params.set('date1', date1);
    }
    if (date2) {
      params = params.set('date2', date2);
    }
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<number[][]>(`${this.apiUrl}/lineChart`, { params }).pipe(
        catchError(this.handleError)
    );
  }


}
