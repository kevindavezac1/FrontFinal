import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Usuario } from '../../../components/interfaces/usuario.interface';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = []; // Tipo explícito para usuarios
  usuariosFiltrados: Usuario[] = []; // Tipo explícito para usuarios filtrados
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'rol', 'telefono', 'email'];

  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroRol: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    try {
      const response = await this.userService.obtenerUsuarios().toPromise();
      if (response.codigo === 200) {
        this.usuarios = response.payload as Usuario[]; // Cast a la interfaz
        this.usuariosFiltrados = this.usuarios; // Inicialmente muestra todos
      } else {
        console.error('Error al obtener usuarios:', response.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error);
    }
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      return (
        (this.filtroNombre ? usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true) &&
        (this.filtroApellido ? usuario.apellido.toLowerCase().includes(this.filtroApellido.toLowerCase()) : true) &&
        (this.filtroRol ? usuario.rol === this.filtroRol : true)
      );
    });
  }

  borrarFiltros(): void {
    this.filtroNombre = '';
    this.filtroApellido = '';
    this.filtroRol = '';
    this.usuariosFiltrados = [...this.usuarios]; // Restaurar a todos los usuarios
  }
}
