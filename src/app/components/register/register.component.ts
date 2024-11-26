import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';  // Servicio para interactuar con el backend

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    dni: '',
    nombre: '',
    apellido: '',
    password: '',
    email: '',
    telefono: '',
    rol: 'Paciente',  // Valor predeterminado, puedes permitir que el rol se seleccione
    fecha_nacimiento: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  onRegister() {
    this.userService.createUser(this.user).subscribe(response => {
      if (response.codigo === 200) {
        this.router.navigate(['/login']);
      } else {
        console.error('Error al registrar usuario');
      }
    });
  }

  hasRole(): boolean {
    return !!this.user.rol && this.user.rol !== 'Paciente';
  }
}