import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {DrhService} from "../../model/drh-service/drh-service";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DrhServiceService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/drh_service';

  constructor(private http: HttpClient) { }



  getAll(): Observable<DrhService[]> {
    return this.http.get<DrhService[]>(`${this.apiUrl}/`);
  }


}