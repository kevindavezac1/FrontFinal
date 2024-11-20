import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-popup-login',
  templateUrl: './popup-login.component.html',
  styleUrls: ['./popup-login.component.css']
})
export class PopupLoginComponent {
  constructor(private router: Router) {}

  inicio(){
    this.router.navigate(['']);
  }

}
