import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
    rol: 'Paciente',  // Valor predeterminado
    fecha_nacimiento: ''
  };

  repeatPassword: string = ''; // Nuevo campo para repetir contraseña

  constructor(private userService: UserService, private router: Router) {}

  onRegister() {
    if (!this.validatePasswords()) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    this.userService.createUser(this.user).subscribe(response => {
      if (response.codigo === 200) {
        alert('Usuario creado con exito');
        this.router.navigate(['/login']);
      } else {
        console.error('Error al registrar usuario');
      }
    });
  }

  validatePasswords(): boolean {
    return this.user.password === this.repeatPassword;
  }

  hasRole(): boolean {
    return !!this.user.rol && this.user.rol !== 'Paciente';
  }
}
