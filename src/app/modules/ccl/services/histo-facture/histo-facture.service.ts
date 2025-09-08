import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Page} from "../../interface/page.interface";
import {Gestionnaire} from "../../model/gestionnaire/gestionnaire";
import {HistoFacture} from "../../model/histo-facture/histo-facture";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HistoFactureService{
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/histo_facture';

  constructor(private http: HttpClient) { }

  getByFacture(id:string): Observable<HistoFacture[]> {
    return this.http.get<HistoFacture[]>(`${this.apiUrl}/facture/${id}`);
  }

}