import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { CoberturaService } from 'src/app/services/cobertura.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-operador-asignar-turnos',
  templateUrl: 'asignar-turnos-operador.component.html',
  styleUrls: ['asignar-turnos-operador.component.css']
})

export class AsignarTurnosOperadorComponent implements OnInit {

  coberturas: any[] = [];
  especialidades: any[] = [];
  profesionales: any[] = [];
  agenda: any[] = [];
  fechasDisponibles: string[] = [];
  horasDisponibles: string[] = [];
  pacientes: any[] = [];
  errorMessage: string = "";

  form = this.fb.group({
    'cobertura': ['', Validators.required],
    'especialidad': ['', Validators.required],
    'profesional': ['', Validators.required],
    'fecha': ['', Validators.required],
    'hora': ['', Validators.required],
    'notas': ['', Validators.required],
    'paciente': ['', Validators.required] 
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private coberturaService: CoberturaService,
    private turnoService: TurnoService,
    private especialidaService: EspecialidadService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
    this.cargarCoberturas();
    this.cargarPacientes(); // Cargar los pacientes al inicializar el componente
  }

  async cargarCoberturas() {
    try {
      const data: any = await firstValueFrom(this.coberturaService.getCoberturas());
      this.coberturas = data.payload;
      console.log("Coberturas cargadas:", this.coberturas);
    } catch (error) {
      console.error("Error al cargar coberturas:", error);
    }
  }

  async cargarEspecialidades() {
    try {
      const response = await firstValueFrom(this.turnoService.obtenerEspecialidades());
      if (response && Array.isArray(response.payload)) {
        this.especialidades = response.payload;
      } else {
        console.error('La respuesta no contiene un array en payload');
      }
    } catch (error) {
      console.error('Error al cargar especialidades', error);
    }
  }

  async cargarPacientes() {
    try {
      const response = await firstValueFrom(this.userService.obtenerUsuarios());
      console.log('Respuesta completa del servidor:', response);
  
      // Asegúrate de que response y payload existan
      if (response && response.payload) {
        this.pacientes = response.payload.filter((usuario: { rol: string }) => usuario.rol === 'Paciente');
        console.log('Pacientes cargados:', this.pacientes);
      } else {
        console.error('Payload no encontrado en la respuesta del servidor:', response);
      }
    } catch (error) {
      console.error('Error al cargar pacientes', error);
    }
  }
  


  onPacienteChange(pacienteId: number): void {
    firstValueFrom(this.coberturaService.getCoberturaDelUsuario(pacienteId)).then(
      (response) => {
        if (response && response.payload) {
          const cobertura = response.payload;
          this.form.patchValue({ cobertura: cobertura.id }); // Asignar la cobertura al formulario
          console.log('Cobertura del usuario:', cobertura);
        } else {
          console.error('La respuesta no contiene una cobertura válida');
        }
      }
    ).catch((error) => {
      console.error('Error al obtener cobertura del usuario:', error);
    });
  }
  
  
  

  async onEspecialidadChange(especialidadId: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.turnoService.obtenerMedicosPorEspecialidad(especialidadId));
      if (response && Array.isArray(response.payload)) {
        this.profesionales = response.payload;
      } else {
        console.error('La respuesta no contiene un array en payload');
      }
    } catch (error) {
      console.error('Error al obtener profesionales', error);
    }
  }

  async onProfesionalChange(profesionalId: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.turnoService.obtenerAgenda(profesionalId));
      this.agenda = response.payload;
      this.filtrarDisponibilidad();
    } catch (error) {
      console.error('Error al obtener agenda', error);
    }
  }

  filtrarDisponibilidad(): void {
    if (Array.isArray(this.agenda)) {
      this.fechasDisponibles = [...new Set(this.agenda.map(item => item.fecha))];
      this.horasDisponibles = [];

      this.agenda.forEach(item => {
        const startTime = new Date(`1970-01-01T${item.hora_entrada}:00`);
        const endTime = new Date(`1970-01-01T${item.hora_salida}:00`);

        while (startTime < endTime) {
          const horaFormateada = startTime.toTimeString().slice(0, 5);
          if (!this.horasDisponibles.includes(horaFormateada)) {
            this.horasDisponibles.push(horaFormateada);
          }
          startTime.setMinutes(startTime.getMinutes() + 30);
        }
      });
    } else {
      console.error('Agenda no es un array');
    }
  }

  async asignarTurno() {
    if (this.form.valid) {
      const idAgenda = this.obtenerIdAgenda();
      if (!idAgenda) {
        console.error('id_agenda no válido');
        return;
      }
  
      const turnoData = {
        nota: this.form.get('notas')?.value,
        id_agenda: idAgenda, 
        fecha: this.form.get('fecha')?.value,
        hora: this.form.get('hora')?.value,
        id_paciente: Number(this.form.get('paciente')?.value), 
        id_cobertura: Number(this.form.get('cobertura')?.value), 
      };
  
      try {
        const response = await firstValueFrom(this.turnoService.crearTurno(turnoData));
        console.log('Turno asignado exitosamente', response);
        alert('Turno asignado.');
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al asignar turno', error);
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  obtenerIdAgenda(): number {
    const fechaSeleccionada = this.form.get('fecha')?.value;
    const horaSeleccionada = this.form.get('hora')?.value;

    if (!fechaSeleccionada || !horaSeleccionada) {
      console.error('La fecha o la hora no han sido seleccionadas');
      return 0;
    }

    const agendaItem = this.agenda.find(item => 
      item.fecha === fechaSeleccionada &&
      horaSeleccionada >= item.hora_entrada &&
      horaSeleccionada <= item.hora_salida
    );

    return agendaItem ? agendaItem.id : 0;
  }
}
