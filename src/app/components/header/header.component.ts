import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService) {}

  
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.userName = this.authService.getUserName();  // Obtén el nombre
        this.userRole = this.authService.getUserRoleFromToken();  // Obtén el rol
        console.log("User Role en Header:", this.userRole);  // Verifica que el rol esté siendo recibido
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }
  
  

  onLogout() {
    this.authService.logout();
  }
}
