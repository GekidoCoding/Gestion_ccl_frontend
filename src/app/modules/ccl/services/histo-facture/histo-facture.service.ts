import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {Gestionnaire} from "../../model/gestionnaire/gestionnaire";
import {HistoFacture} from "../../model/histo-facture/histo-facture";

@Injectable({
  providedIn: 'root'
})
export class HistoFactureService{
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/histo_facture';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getByFacture(id:string): Observable<HistoFacture[]> {
    return this.http.get<HistoFacture[]>(`${this.apiUrl}/facture/${id}`).pipe(
        catchError(this.handleError)
    );
  }

}