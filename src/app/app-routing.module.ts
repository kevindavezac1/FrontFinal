import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { AuthGuard } from './guards/auth.guard';
import { ListarUsuariosComponent } from './components/administrador/listar-usuarios/listar-usuarios.component';
import { CrearUserOperadorComponent } from './components/operador/crear-user-operador/crear-user-operador.component';

const routes: Routes = [
  { path: '', component: BienvenidaComponent }, // Página pública
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'listar-usuarios',component:ListarUsuariosComponent},
  { path: 'crear-usuario', component: CrearUserOperadorComponent },
  { path: '**', redirectTo: '' }, // Redirigir a la página de bienvenida si no coincide con ninguna ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
