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

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  onRegister() {
    if (!this.validatePasswords()) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    this.userService.createUser(this.user).subscribe(response => {
      if (response.codigo === 200) {
        alert('Usuario creado con éxito');
        const userRole = this.authService.getUserRole();
        if (userRole === 'Operador') {
          this.router.navigate(['']); // Ruta específica para el operador
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        console.error('Error al registrar usuario');
      }
    });
  }

  validatePasswords(): boolean {
    return this.user.password === this.repeatPassword;
  }
}