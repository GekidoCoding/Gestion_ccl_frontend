import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Direction} from "../../model/direction/direction";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private apiUrl = environment.PRINCIPAL+environment.PREFIX+'/direction';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`${this.apiUrl}/`);
  }

}