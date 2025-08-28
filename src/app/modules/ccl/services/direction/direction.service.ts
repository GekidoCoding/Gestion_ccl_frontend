import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Direction} from "../../model/direction/direction";

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/direction';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }

}