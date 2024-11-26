// listar-usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Usuario } from '../../../components/interfaces/usuario.interface';  // Importamos la interfaz Usuario

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  users: Usuario[] = [];  // Ahora sabemos que 'users' es un arreglo de 'Usuario'
  filters = {
    nombre: '',
    apellido: '',
    rol: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();  // Obtener usuarios al cargar el componente
  }

  // Obtener usuarios con los filtros aplicados
  getUsers(): void {
    this.userService.getUsers(this.filters).subscribe(response => {
      console.log(response);  // Verifica la respuesta en la consola
      if (response.codigo === 200) {
        this.users = response.payload;  // Asigna la lista de usuarios al array 'users'
      } else {
        console.error('Error al obtener usuarios', response.mensaje);
      }
    });
  }
  // Aplicar filtros y obtener la lista filtrada
  applyFilters(): void {
    this.getUsers();  // Recargar usuarios con los filtros aplicados
  }
}
