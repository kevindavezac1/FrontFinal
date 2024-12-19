import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; 

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
      this.userName = this.authService.getUserName();  
    } else {
      this.isLoggedIn = false;
    }
  }

  onLogout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }
}
