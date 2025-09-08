import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Page} from "../../interface/page.interface";
import {Admin} from "../../model/admin/admin";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl =  environment.PRINCIPAL+environment.PREFIX+'/admin';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/`);
  }

  create(categorieInfra: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/create`, categorieInfra);
  }


  delete(id: string): Observable<Admin> {
    return this.http.delete<Admin>(`${this.apiUrl}/delete/${id}`);
  }
}