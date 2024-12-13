import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CoberturaService } from 'src/app/services/cobertura.service';
import { TurnoService } from 'src/app/services/turno.service';

interface Cobertura {
  nombre: string;
  id: number;
}

interface Especialidad {
  descripcion: string;
  id: number;
}

interface Profesional {
  nombre: string;
  apellido: string;
  id_medico: number;
  horarioInicio: string;
  horarioFin: string;
}

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css'],
})
export class NuevoTurnoComponent implements OnInit {
  form = this.fb.group({
    cobertura: ['', Validators.required],
    especialidad: [{ value: '' }, Validators.required],
    profesional: [{ value: '', disabled: true }, Validators.required],
    fecha: [{ value: '', disabled: true }, Validators.required],
    hora: [{ value: '', disabled: true }, Validators.required],
    notas: ['', Validators.required],
  });

  mensajeNoDisponibilidad: string | null = null;
  cobertura: Cobertura | null = null;
  especialidades: Especialidad[] = [];
  profesionales: Profesional[] = [];
  horasDisponibles: string[] = [];
  idAgenda: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private coberturaService: CoberturaService,
    private turnoService: TurnoService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('Contenido de localStorage:', localStorage.getItem('payload'));
    const userId = this.authService.getUserId();
    if (userId !== null) {
      await this.cargarCoberturas(userId);
      await this.cargarEspecialidades();
    } else {
      console.error('No se encontró el ID del usuario.');
    }
  }

  async cargarCoberturas(userId: number): Promise<void> {
    try {
      const response: any = await firstValueFrom(this.coberturaService.getCoberturaDelUsuario(userId));
      if (response && response.payload) {
        this.cobertura = response.payload;
        console.log('Cobertura cargada:', this.cobertura);

        this.form.patchValue({
          cobertura: this.cobertura?.id ? String(this.cobertura.id) : '',
        });
      } else {
        console.warn('No se encontró cobertura asociada al usuario.');
        this.cobertura = null;
      }
    } catch (error) {
      console.error('Error al cargar la cobertura:', error);
      this.cobertura = null;
    }
  }

  async cargarEspecialidades(): Promise<void> {
    try {
      const data: any = await firstValueFrom(this.turnoService.obtenerEspecialidades());
      if (data && data.payload) {
        this.especialidades = data.payload;
        console.log('Especialidades cargadas:', this.especialidades);
      } else {
        console.warn('No se encontraron especialidades.');
        this.especialidades = [];
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    }
  }

  async cambiarEspecialidad(): Promise<void> {
    const idEspecialidad = Number(this.form.get('especialidad')?.value);
    if (idEspecialidad) {
      try {
        const data: any = await firstValueFrom(
          this.turnoService.obtenerMedicosPorEspecialidad(idEspecialidad)
        );
        this.profesionales = data.payload;
        console.log('Médicos cargados para la especialidad:', this.profesionales);
        if (this.profesionales.length > 0) {
          this.form.get('profesional')?.enable();
        } else {
          this.form.get('profesional')?.disable();
        }
      } catch (error) {
        console.error('Error al cargar médicos por especialidad:', error);
      }
    }
  }

  async cambiarProfesional(): Promise<void> {
    const profesionalSeleccionadoValue = this.form.get('profesional')?.value;
    const profesionalSeleccionado = profesionalSeleccionadoValue
      ? parseInt(profesionalSeleccionadoValue, 10)
      : 0;

    if (profesionalSeleccionado) {
      try {
        const data: any = await firstValueFrom(
          this.turnoService.obtenerAgenda(profesionalSeleccionado)
        );
        const agenda = data.payload;
        console.log('Agenda para el profesional:', agenda);

        if (agenda && agenda.length > 0) {
          this.form.get('fecha')?.enable();
          this.form.get('hora')?.disable();
        } else {
          this.form.get('fecha')?.disable();
          this.form.get('hora')?.disable();
        }
      } catch (error) {
        console.error('Error al obtener la agenda del profesional:', error);
      }
    }
  }

  async cambiarFechas(): Promise<void> {
    const fechaSeleccionada = this.form.get('fecha')?.value;
    const profesionalSeleccionadoValue = this.form.get('profesional')?.value;
    const profesionalSeleccionado = profesionalSeleccionadoValue
      ? parseInt(profesionalSeleccionadoValue, 10)
      : 0;
  
    this.mensajeNoDisponibilidad = null; // Reseteamos el mensaje
  
    if (fechaSeleccionada && profesionalSeleccionado) {
      try {
        const agendaData: any = await firstValueFrom(
          this.turnoService.obtenerAgenda(profesionalSeleccionado)
        );
        const agenda = agendaData.payload.filter((item: any) => {
          const fechaAgenda = new Date(item.fecha).toISOString().split('T')[0];
          return fechaAgenda === fechaSeleccionada;
        });
  
        if (agenda.length > 0) {
          this.idAgenda = agenda[0].id;
  
          const turnosData: any = await firstValueFrom(
            this.turnoService.obtenerTurnosPorMedicoYFecha(profesionalSeleccionado, fechaSeleccionada)
          );
          const turnosOcupados = turnosData.payload.map((turno: any) => turno.hora);
  
          const horasDisponibles: string[] = [];
          agenda.forEach((item: any) => {
            this.generarHorasDisponibles(item.hora_entrada, item.hora_salida, horasDisponibles);
          });
          this.horasDisponibles = horasDisponibles.filter(hora => !turnosOcupados.includes(hora));
  
          if (this.horasDisponibles.length > 0) {
            this.form.get('hora')?.enable();
          } else {
            this.form.get('hora')?.disable();
            this.mensajeNoDisponibilidad = 'No hay horarios disponibles para este día.';
          }
        } else {
          this.mensajeNoDisponibilidad = 'No hay agenda disponible para esta fecha.';
          this.horasDisponibles = [];
          this.form.get('hora')?.disable();
        }
      } catch (error) {
        console.error('Error al obtener horarios:', error);
        this.mensajeNoDisponibilidad = 'Error al consultar los horarios. Inténtelo más tarde.';
      }
    } else {
      this.mensajeNoDisponibilidad = 'Debe seleccionar una fecha y un profesional válidos.';
      this.form.get('hora')?.disable();
    }
  }
  
  

  generarHorasDisponibles(horaEntrada: string, horaSalida: string, horasDisponibles: string[]) {
    const startHour = new Date(`1970-01-01T${horaEntrada}:00`);
    const endHour = new Date(`1970-01-01T${horaSalida}:00`);

    for (let hora = startHour; hora < endHour; hora.setHours(hora.getHours() + 1)) {
      const horaFormato = `${hora.getHours().toString().padStart(2, '0')}:00`;
      if (!horasDisponibles.includes(horaFormato)) {
        horasDisponibles.push(horaFormato);
      }
    }
  }

  async obtenerTurnosDelDia(idMedico: number, fecha: string): Promise<string[]> {
    // Simular llamada para obtener turnos ocupados (puedes reemplazar con una API real)
    try {
      const data: any = await firstValueFrom(
        this.turnoService.obtenerTurnosPorMedicoYFecha(idMedico, fecha)
      );
      return data.payload.map((turno: any) => turno.hora);
    } catch (error) {
      console.error('Error al obtener turnos del día:', error);
      return [];
    }
  }

  async enviar() {
    const datosUser = localStorage.getItem('payload');

    if (!datosUser) {
      console.warn('No se encontraron datos de usuario en localStorage');
      return;
    }

    const parsedData = JSON.parse(datosUser);
    const idUsuario = parsedData?.id;

    if (!idUsuario) {
      console.warn('ID Usuario no encontrado:', parsedData);
      return;
    }

    if (this.form.valid && this.idAgenda !== null) {
      const turnoData = {
        nota: this.form.get('notas')?.value!,
        id_agenda: this.idAgenda,
        fecha: this.form.get('fecha')?.value!,
        hora: this.form.get('hora')?.value!,
        id_paciente: idUsuario,
        id_cobertura: Number(this.form.get('cobertura')?.value),
      };

      console.log('Datos del turno a enviar:', turnoData);

      try {
        const response = await firstValueFrom(this.turnoService.asignarTurnoPaciente(turnoData));
        console.log('Respuesta del servidor:', response);
        alert(`Turno confirmado con el especialista el día ${turnoData.fecha} a las ${turnoData.hora}`);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al asignar el turno:', error);
      }
    } else {
      console.warn('No se puede enviar el formulario. Verifica los valores:');
      console.warn('Formulario inválido:', this.form.value);
      if (this.idAgenda === null) console.warn('ID Agenda no configurado.');
    }
  }

  botonCancelar(): void {
    this.router.navigate(['/home']);
  }
}
