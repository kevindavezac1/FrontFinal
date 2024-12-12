// cobertura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CoberturaService {
  private apiUrl = 'http://localhost:4000/api/coberturas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', token); // Sin 'Bearer'
  }

  getCoberturas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Método para obtener la cobertura del usuario
  getCoberturaDelUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`,{headers: this.getHeaders()}); // Llama al endpoint que creamos en el backend
  }

  createCobertura(cobertura: any): Observable<any> {
    return this.http.post(this.apiUrl, cobertura, {
      headers: this.getHeaders(),
    });
  }

  updateCobertura(id: number, cobertura: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cobertura, {
      headers: this.getHeaders(),
    });
  }

  deleteCobertura(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
