import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-user-admin.component.html',
  styleUrls: ['./crear-user-admin.component.css']
})
export class CrearUserAdminComponent implements OnInit {
  user: any = {
    dni: '',
    nombre: '',
    apellido: '',
    password: '',
    email: '',
    telefono: '',
    rol: 'Operador', // Valor predeterminado
    fecha_nacimiento: '',
    id_cobertura: '',
    id_especialidad: '' // Para especialidad si es médico
  };
  coberturas: any[] = []; 
  especialidades: any[] = []; 

  constructor(private http: HttpClient, private turnoService: TurnoService) {}

  async ngOnInit() {
    // Cargar coberturas
    try {
      const response = await this.http.get<any[]>('http://localhost:4000/api/coberturas').toPromise();
      this.coberturas = response || [];
      console.log('Coberturas cargadas:', this.coberturas);
    } catch (error) {
      console.error('Error al cargar coberturas:', error);
    }

    // Cargar especialidades
    try {
      const response = await firstValueFrom(this.turnoService.obtenerEspecialidades());
      if (response.codigo === 200) {
        this.especialidades = response.payload as any[];
        console.log('Especialidades cargadas:', this.especialidades);
      } else {
        console.error('Error al obtener especialidades:', response.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    }
  }

  // Acción al cambiar el rol
  onRoleChange() {
    if (this.user.rol === 'Medico') {
      this.cargarEspecialidades();
    } else {
      this.user.id_especialidad = null; // Limpiar especialidad si cambia a otro rol
    }
  }

  async cargarEspecialidades() {
    try {
      const response = await firstValueFrom(this.turnoService.obtenerEspecialidades());
      if (response.codigo === 200) {
        this.especialidades = response.payload as any[];
        console.log('Especialidades cargadas:', this.especialidades);
      } else {
        console.error('Error al obtener especialidades:', response.mensaje);
        alert('No se pudieron cargar las especialidades. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      this.especialidades = [];
    }
  }

  onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      this.http.post('http://localhost:4000/api/crearUsuario', this.user)
        .subscribe({
          next: (response) => {
            console.log('Usuario creado:', response);
            alert('Usuario creado correctamente');
            userForm.resetForm({ rol: 'Paciente' }); // Restablecer formulario con valor predeterminado
          },
          error: (error) => {
            console.error('Error al crear el usuario:', error);
            alert('Error al crear el usuario. Intenta nuevamente.');
          },
          complete: () => {
            console.log('Solicitud completada');
          }
        });
    }
  }
}