import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';

const routes: Routes = [
  { path: '', component: BienvenidaComponent }, // Página de bienvenida
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // La nueva ruta para la pantalla principal
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
