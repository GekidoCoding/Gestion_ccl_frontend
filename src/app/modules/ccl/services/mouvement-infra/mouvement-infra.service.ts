import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {MouvementInfra} from "../../model/mouvement-infra/mouvement-infra";

@Injectable({
  providedIn: 'root'
})
export class MouvementInfraService {
  private apiUrl = `${environment.PRINCIPAL}/cnaps/gestion/ccl/mouvement_infra`;

  constructor(private http: HttpClient) {}

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  create(mouvementInfra: MouvementInfra): Observable<MouvementInfra> {
    return this.http.post<MouvementInfra>(`${this.apiUrl}/create`, mouvementInfra);
  }

  update(id: string, activite: MouvementInfra): Observable<MouvementInfra> {
    return this.http.put<MouvementInfra>(`${this.apiUrl}/update/${id}`, activite);
  }
}