import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title="Proyecto Clinica"
  isLoggedIn = false;
  userName = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.userName = this.authService.getUserName();
    });
  }
  

  onLogin() {
    console.log('Redirigiendo a /login');
    this.router.navigate(['/login']); // Navegar a la página de login
  }

  onLogout() {
    this.authService.logout();
  }
}
