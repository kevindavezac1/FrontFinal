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
    console.log('Contenido de sessionStorage:', sessionStorage.getItem('datosUsuario'));
    const userId = this.authService.getUserId();
    if (userId !== null) {
      await this.cargarCoberturas(userId);
      await this.cargarEspecialidades(); // Llama aquí para cargar las especialidades
    } else {
      console.error("No se encontró el ID del usuario.");
    }
  }

  async cargarCoberturas(userId: number): Promise<void> {
    try {
      const response: any = await firstValueFrom(this.coberturaService.getCoberturaDelUsuario(userId));
      if (response && response.payload) {
        this.cobertura = response.payload;
        console.log('Cobertura cargada:', this.cobertura);
        
        // Establecer el valor de cobertura en el formulario
        this.form.patchValue({
          cobertura: this.cobertura?.id ? String(this.cobertura.id) : '' // Si es null, asigna un string vacío
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
      console.log("Cargando especialidades..."); // Log para verificar ejecución
      const data: any = await firstValueFrom(this.turnoService.obtenerEspecialidades());
      if (data && data.payload) {
        this.especialidades = data.payload;
        console.log("Especialidades cargadas:", this.especialidades);
      } else {
        console.warn("No se encontraron especialidades.");
        this.especialidades = [];
      }
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
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

    if (fechaSeleccionada && profesionalSeleccionado) {
      try {
        const data: any = await firstValueFrom(
          this.turnoService.obtenerAgenda(profesionalSeleccionado)
        );
        const agenda = data.payload;
        const agendaDelDia = agenda.filter((item: any) => {
          const fechaAgenda = new Date(item.fecha).toISOString().split('T')[0];
          return fechaAgenda === fechaSeleccionada;
        });

        if (agendaDelDia.length > 0) {
          this.idAgenda = agendaDelDia[0].id;
          const horasDisponibles: string[] = [];
          agendaDelDia.forEach((item: any) => {
            const { hora_entrada, hora_salida } = item;
            this.generarHorasDisponibles(hora_entrada, hora_salida, horasDisponibles);
          });

          this.horasDisponibles = horasDisponibles;
          this.form.get('hora')?.enable();
        } else {
          this.form.get('hora')?.disable();
          this.form.get('hora')?.setValue(null);
        }
      } catch (error) {
        console.error('Error al obtener la agenda del profesional:', error);
      }
    }
  }

  generarHorasDisponibles(horaEntrada: string, horaSalida: string, horasDisponibles: string[]) {
    const startHour = new Date(`1970-01-01T${horaEntrada}:00`);
    const endHour = new Date(`1970-01-01T${horaSalida}:00`);

    for (let hora = startHour; hora < endHour; hora.setHours(hora.getHours() + 1)) {
      const horaFormato = `${hora.getHours().toString().padStart(2, '0')}:00hs a ${(hora.getHours() + 1)
        .toString()
        .padStart(2, '0')}:00hs`;
      if (!horasDisponibles.includes(horaFormato)) {
        horasDisponibles.push(horaFormato);
      }
    }
  }

  async enviar() {
    const datosUser = localStorage.getItem('payload'); // Obtén el valor de 'payload'
    
    if (!datosUser) {
      console.warn('No se encontraron datos de usuario en localStorage');
      return;
    }
  
    const parsedData = JSON.parse(datosUser); // Convierte el string JSON a objeto
    const idUsuario = parsedData?.id; // Accede al id del usuario
  
    if (!idUsuario) {
      console.warn('ID Usuario no encontrado:', parsedData);
      return;
    }
  
    console.log('ID Usuario:', idUsuario); 
  
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
