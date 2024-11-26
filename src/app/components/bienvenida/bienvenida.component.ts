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
      loggedIn => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          try {
            this.userName = this.authService.getUserName();
            this.userRole = this.authService.getUserRoleFromToken();
          } catch (error) {
            console.error('Error al obtener datos del token:', error);
          }
        }
      },
      error => {
        console.error('Error al verificar sesión:', error);
      }
    );
  }
}
