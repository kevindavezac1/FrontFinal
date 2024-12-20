import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          try {
            const name = this.authService.getUserName(); // Extrae el nombre
            const role = this.authService.getUserRole(); // Extrae el rol
            this.userName = name;
            this.userRole = role;
          } catch (error) {
            console.error('Error al obtener datos del payload:', error);
          }
        }
      },
      (error) => {
        console.error('Error al verificar sesión:', error);
      }
    );
  }
  

  logout(): void {
    this.authService.logout(); // Llama al método logout del servicio
  }
}
