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
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { DatosPersonalesComponent } from './components/paciente/datos-personales/datos-personales.component';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';
import { GestionEspecialidadesComponent } from './components/administrador/gestion-especialidad/gestion-especialidad.component';
import { AsignarTurnosOperadorComponent } from './components/operador/aignar-turnos-operador/asignar-turnos-operador.component';
import { VerAgendaOperadorComponent } from './components/operador/ver-agenda-operador/ver-agenda-operador.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: BienvenidaComponent }, // Página pública
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas protegidas para administradores
  { 
    path: 'listar-usuarios',
    component: ListarUsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' }
  },
  { 
    path: 'crear-usuario',
    component: CrearUserAdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' }
  },
  { 
    path: 'gestion-coberturas',
    component: GestionCoberturasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' }
  },
  { 
    path: 'gestion-especialidad',
    component: GestionEspecialidadesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' }
  },

  // Rutas protegidas para pacientes
  { 
    path: 'nuevo-turno',
    component: NuevoTurnoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Paciente' }
  },
  { 
    path: 'mis-turnos',
    component: MisTurnosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Paciente' }
  },
  { 
    path: 'datos-personales',
    component: DatosPersonalesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Paciente' }
  },

  // Rutas protegidas para médicos
  { 
    path: 'gestion-agenda',
    component: GestionAgendaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Medico' }
  },
  { 
    path: 'turnos-programados',
    component: TurnosProgramadosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Medico' }
  },

  // Rutas protegidas para operadores
  { 
    path: 'asignar-turno',
    component: AsignarTurnosOperadorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Operador' }
  },
  { 
    path: 'ver-agenda-medico-operador',
    component: VerAgendaOperadorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Operador' }
  },

  // Ruta de fallback para redirigir a la página de bienvenida
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
