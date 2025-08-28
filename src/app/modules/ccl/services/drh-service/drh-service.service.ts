import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {DrhService} from "../../model/drh-service/drh-service";

@Injectable({
  providedIn: 'root'
})
export class DrhServiceService {
  private apiUrl = 'http://localhost:8080/cnaps/gestion/ccl/drh_service';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('error API:', error);
    return throwError(() => new Error("Une erreur s'est produite"));
  }

  getAll(): Observable<DrhService[]> {
    return this.http.get<DrhService[]>(`${this.apiUrl}/`).pipe(
        catchError(this.handleError)
    );
  }


}