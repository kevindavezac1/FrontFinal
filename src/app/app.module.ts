import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Necesario para hacer peticiones HTTP
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { RouterModule } from '@angular/router';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { ListarUsuariosComponent } from './components/administrador/listar-usuarios/listar-usuarios.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CrearUserAdminComponent } from './components/administrador/crear-user-admin/crear-user-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogoEditarUsuarioComponent } from './components/administrador/dialog-editar-usuario/dialog-editar-usuario.component';
import { GestionCoberturasComponent } from './components/administrador/gestion-coberturas/gestion-coberturas.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DatosPersonalesComponent } from './components/paciente/datos-personales/datos-personales.component';
registerLocaleData(localeEs, 'es');
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    BienvenidaComponent,
    ListarUsuariosComponent,
    CrearUserAdminComponent,
    DialogoEditarUsuarioComponent,
    GestionCoberturasComponent,
    NuevoTurnoComponent,
    GestionAgendaComponent,
    MisTurnosComponent,
    DatosPersonalesComponent,
    TurnosProgramadosComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSnackBarModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
