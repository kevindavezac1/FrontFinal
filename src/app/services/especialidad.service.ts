import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', token);
  }

  getEspecialidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gestion-especialidades`, { headers: this.getHeaders() });
  }

  createEspecialidad(especialidad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/gestion-especialidades`, especialidad, { headers: this.getHeaders() });
  }

  updateEspecialidad(id: number, especialidad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/gestion-especialidades/${id}`, especialidad, { headers: this.getHeaders() });
  }

  deleteEspecialidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gestion-especialidades/${id}`, { headers: this.getHeaders() });
  }
}
