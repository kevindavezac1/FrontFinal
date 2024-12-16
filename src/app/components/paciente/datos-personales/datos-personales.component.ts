import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CoberturaService } from '../../../services/cobertura.service'; // Servicio para coberturas
import { UsuarioActualizado } from '../../interfaces/usuarioActualizado.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {

  usuarioActualizado: UsuarioActualizado[] = [];
  usuario: any; // Aquí almacenaremos los datos del usuario
  coberturas: any[] = []; // Lista de coberturas disponibles
  loading: boolean = true; // Para mostrar un indicador de carga
  errorMessage: string = ''; // Para mostrar mensajes de error
  modoEdicion: boolean = false; // Variable para saber si estamos editando

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private coberturaService: CoberturaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); // Obtener el ID del usuario desde el token
    if (userId) {
      this.getUsuario(userId);
      this.getCoberturas(); // Cargar lista de coberturas
    } else {
      this.errorMessage = 'No se pudo obtener el ID del usuario.';
      this.loading = false;
    }
  }

  getUsuario(id: number): void {
    this.userService.obtenerUsuarioPorId(id).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.usuario = response.payload[0]; // Suponiendo que el backend devuelve un array
        } else {
          this.errorMessage = response.mensaje;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
        this.errorMessage = 'Ocurrió un error al obtener los datos.';
        this.loading = false;
      }
    });
  }

  getCoberturas(): void {
    this.coberturaService.getCoberturas().subscribe({
      next: (response) => {
        this.coberturas = response; // Guardamos la lista de coberturas disponibles
      },
      error: (err) => {
        console.error('Error al obtener coberturas:', err);
        this.errorMessage = 'Ocurrió un error al cargar las coberturas.';
      }
    });
  }

  habilitarEdicion(): void {
    this.modoEdicion = true; // Habilitar el modo de edición
  }

  guardarCambios(): void {
    const usuarioEditado = {
      id: this.usuario.id,
      apellido: this.usuario.apellido,
      nombre: this.usuario.nombre,
      fecha_nacimiento: this.usuario.fecha_nacimiento,
      rol: this.usuario.rol,
      dni: this.usuario.dni,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      password: this.usuario.password,
      id_cobertura: this.usuario.id_cobertura, // Cobertura seleccionada
    };

    this.userService.actualizarUsuario(this.usuario.id, usuarioEditado).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          alert('Cambios guardados con éxito');
          this.modoEdicion = false; // Vuelve a desactivar el modo de edición
        } else {
          alert('Error al guardar los cambios: ' + response.mensaje);
        }
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
        alert('Ocurrió un error al guardar los cambios.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']); // Navegar a la página principal
  }
}
