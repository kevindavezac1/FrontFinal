import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { AuthGuard } from './guards/auth.guard';
import { ListarUsuariosComponent } from './components/administrador/listar-usuarios/listar-usuarios.component';
import { CrearUserAdminComponent } from './components/administrador/crear-user-admin/crear-user-admin.component';
import { GestionCoberturasComponent } from './components/administrador/gestion-coberturas/gestion-coberturas.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';

const routes: Routes = [
  { path: '', component: BienvenidaComponent }, // Página pública
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'listar-usuarios',component:ListarUsuariosComponent},
  { path: 'crear-usuario', component: CrearUserAdminComponent },
  {path: 'gestion-coberturas', component:GestionCoberturasComponent},
  {path: 'nuevo-turno', component: NuevoTurnoComponent},
  { path: '**', redirectTo: '' }, // Redirigir a la página de bienvenida si no coincide con ninguna ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
