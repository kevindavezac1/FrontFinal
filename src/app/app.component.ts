import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; // Asegúrate de que tengas el servicio AuthService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      this.userName = this.authService.getUserName();  // Método que extrae el nombre del usuario desde el token // Método que extrae el rol del usuario desde el token
    } else {
      this.isLoggedIn = false;
    }
  }

  // Este método puede ser llamado cuando el usuario cierre sesión
  onLogout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }
}
