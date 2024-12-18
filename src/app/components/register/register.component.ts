import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CoberturaService } from 'src/app/services/cobertura.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    dni: '',
    nombre: '',
    apellido: '',
    password: '',
    email: '',
    telefono: '',
    rol: 'Paciente',  // Valor predeterminado
    fecha_nacimiento: '',
    id_cobertura: ''
  };
  coberturas: any[] = []; 
  repeatPassword: string = ''; // Nuevo campo para repetir contraseña
  
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private coberturaService : CoberturaService
  ) {}

  async ngOnInit() {
    try {
      const response = await firstValueFrom(this.coberturaService.getCoberturas());
      this.coberturas = response || [];
      console.log('Coberturas cargadas:', this.coberturas);
    } catch (error) {
      console.error('Error al cargar coberturas:', error);
    }
  }

  onRegister() {
    if (!this.isFormValid()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

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

  isFormValid(): boolean {
    // Verificar que todos los campos requeridos no estén vacíos
    return (
      this.user.dni !== '' &&
      this.user.nombre !== '' &&
      this.user.apellido !== '' &&
      this.user.password !== '' &&
      this.user.email !== '' &&
      this.user.telefono !== '' &&
      this.user.fecha_nacimiento !== '' &&
      this.user.id_cobertura !== '' &&
      this.validatePasswords()  // Verificar que las contraseñas coincidan
    );
  }

  hasRole(): boolean {
    return !!this.user.rol && this.user.rol !== 'Paciente';
  }
}
