import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-user-operador.component.html',
  styleUrls: ['./crear-user-operador.component.css']
})
export class CrearUserOperadorComponent implements OnInit {
  user: any = {}; // Datos del formulario
  coberturas: any[] = []; // Lista de coberturas disponibles

  constructor(private http: HttpClient) {}

  // Cargar coberturas al iniciar el componente
  async ngOnInit() {
    try {
      const response = await this.http.get<any[]>('http://localhost:4000/api/coberturas').toPromise();
      this.coberturas = response || [];
      console.log('Coberturas obtenidas:', this.coberturas);
    } catch (error) {
      console.error('Error al cargar coberturas:', error);
    }
  }

  // Enviar datos del formulario
  onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      console.log('Datos enviados:', this.user); // Depuración
      this.http.post('http://localhost:4000/api/admin/pacientes', this.user)
        .subscribe(
          (response) => {
            console.log('Paciente creado con éxito:', response);
            alert('Paciente creado correctamente');
            userForm.resetForm(); // Limpiar el formulario tras el éxito
          },
          (error) => {
            console.error('Error al crear el paciente:', error);
            alert('Error al crear el paciente. Intenta nuevamente.');
          }
        );
    }
  }
}
