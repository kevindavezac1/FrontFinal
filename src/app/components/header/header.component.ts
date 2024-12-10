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
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        try {
          this.userName = this.authService.getUserName(); 
          this.userRole = this.authService.getUserRole(); 
        } catch (error) {
          console.error('Error al obtener datos del payload en Header:', error);
        }
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
