import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', token);
  }

  crearTurno(turno: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, turno, {
      headers: this.getHeaders(),
    });
  }

  obtenerEspecialidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerEspecialidades`, {
      headers: this.getHeaders(),
    });
  }

  obtenerMedicosPorEspecialidad(id_especialidad: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${id_especialidad}`, {
      headers: this.getHeaders(),
    });
  }

  obtenerEspecialidadesPorMedico(id_medico: number): Observable<any> {

    return this.http.get(`${this.apiUrl}/obtenerEspecialidadesMedico/${id_medico}`, {headers: this.getHeaders()});
  }

  asignarTurnoPaciente(data: any):Observable<any>{
    
    return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, data, { headers : this.getHeaders() });
  }

  //deberia cambiarlo a cobertura.service.ts
  obtenerCoberturaDelUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/coberturas/${id}`, {
      headers: this.getHeaders(),
    });
  }

  //deberia cambiarlo a agenda.service.ts
  obtenerAgenda(id_medico: number): Observable<any> {
    const url = `${this.apiUrl}/obtenerAgenda/${id_medico}`;
    console.log(`Llamando a la API: ${url}`); // Log para verificar la URL
    return this.http.get(url, { headers: this.getHeaders() });
  }
  

  obtenerTurnosPorMedicoYFecha(id_medico: number, fecha: string): Observable<any> {
    const url = `${this.apiUrl}/obtenerTurnosMedico`;
    const body = { id_medico, fecha };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }
  

}