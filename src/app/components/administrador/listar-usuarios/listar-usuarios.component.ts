import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Usuario } from '../../../components/interfaces/usuario.interface';
import { DialogoEditarUsuarioComponent } from '../dialog-editar-usuario/dialog-editar-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido','dni', 'rol','nombre_cobertura', 'telefono', 'email', 'acciones'];
  usuarioSeleccionado: Usuario | null = null;

  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroRol: string = '';

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> { 
    try {
      const response = await lastValueFrom(this.userService.obtenerUsuarios());

      if (response.codigo === 200) {
        this.usuarios = response.payload as Usuario[];
        this.usuariosFiltrados = this.usuarios;
      } else {
        console.error('Error al obtener usuarios:', response.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error);
    }
  }

  aplicarFiltros(): void {
    const filtroNombre = this.filtroNombre.toLowerCase();
    const filtroApellido = this.filtroApellido.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      (!this.filtroNombre || usuario.nombre?.toLowerCase().includes(filtroNombre)) &&
      (!this.filtroApellido || usuario.apellido?.toLowerCase().includes(filtroApellido)) &&
      (!this.filtroRol || usuario.rol === this.filtroRol)
    );
  }

  borrarFiltros(): void {
    this.filtroNombre = '';
    this.filtroApellido = '';
    this.filtroRol = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  abrirEditarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(DialogoEditarUsuarioComponent, {
      width: '400px',
      data: { ...usuario }
    });
  
    dialogRef.afterClosed().subscribe((result: Usuario | null) => {
      if (result) {
        this.actualizarUsuario(result);
      } else {
        console.log('Edición cancelada');
      }
    });
  }
  
  actualizarUsuario(usuario: Usuario): void {
    if (usuario.id !== undefined) {
      this.userService.actualizarUsuario(usuario.id, usuario).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
        }
      });
    } else {
      console.error('No se puede actualizar, el ID es undefined');
    }
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  guardarCambios(): void {
    if (this.usuarioSeleccionado?.id !== undefined) {
      this.userService.actualizarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
        next: () => {
          const index = this.usuarios.findIndex(u => u.id === this.usuarioSeleccionado?.id);
          if (index !== -1) {
            this.usuarios[index] = { ...(this.usuarioSeleccionado as Usuario) };
            this.aplicarFiltros();
          }
          this.usuarioSeleccionado = null;
        },
        error: (err) => {
          console.error('Error al guardar cambios:', err);
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
  }
}
