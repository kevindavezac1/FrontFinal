import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {

  usuarios = [];  // Array donde se almacenarán los usuarios
  displayedColumns: string[] = ['id', 'nombre','apellido', 'rol','telefono', 'email'];  // Definir las columnas a mostrar

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    try {
      const response = await this.userService.obtenerUsuarios().toPromise();
      if (response.codigo === 200) {
        this.usuarios = response.payload;  // Asigna los usuarios obtenidos
        console.log('Usuarios:', this.usuarios);  // Verifica los datos en la consola
      } else {
        console.error('Error al obtener usuarios:', response.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error);
    }
  }
}
