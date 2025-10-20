import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Facture} from "../../model/facture/facture";
import {Page} from "../../interface/page.interface";
import {Infrastructure} from "../../model/infrastructure/infrastructure";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = environment.SERVER_URL+environment.PREFIX+'/facture';

  constructor(private http: HttpClient) { }

  create(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/create/new`, facture);
  }
  udpate(id:string, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/update/new/${id}`, facture);
  }
  getRemise(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/config/remise`);
  }
  delete(id:string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
  getById(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/dto/${id}`);
  }

  getDefaultProforma(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/default/proforma/${id}`);
  }
  getByMouvementId(id: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/mouvement/${id}`);
  }
  downloadProforma(idMouvement: string, isRegister: boolean): Observable<Blob> {
    return this.http.post(
        `${this.apiUrl}/export-proforma/${idMouvement}/${isRegister}`,
        {},
        { responseType: 'blob' }
    );
  }
  downloadContrat(idFacture: string): Observable<Blob> {
    return this.http.post(
        `${this.apiUrl}/export-contrat/${idFacture}`,
        {},
        { responseType: 'blob' }
    );
  }
  downloadProformaExist(idFacture: string): Observable<Blob> {
    return this.http.post(
        `${this.apiUrl}/export-proforma/exist/${idFacture}`,
        {},
        { responseType: 'blob' }
    );
  }
  downloadFacturePaiement(idPaiement: string): Observable<Blob> {
    return this.http.post(
        `${this.apiUrl}/export-facture/${idPaiement}`,
        {},
        { responseType: 'blob' }
    );
  }

  sendFactureEmail(id: string, destinataires: string[]): Observable<string> {
    const body = {
      id,
      destinataires
    };
    return this.http.post<string>(`${this.apiUrl}/sendEmail/facture`, body);
  }

  sendContratEmail(id: string, destinataires: string[]): Observable<string> {
    const body = {
      id,
      destinataires
    };
    return this.http.post<string>(`${this.apiUrl}/sendEmail/contrat`, body);
  }

  sendPaiementEmail(id: string, destinataires: string[]): Observable<string> {
    const body = {
      id,
      destinataires
    };
    return this.http.post<string>(`${this.apiUrl}/sendEmail/paiement`, body);
  }



}