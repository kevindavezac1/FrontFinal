import { Component, OnInit } from '@angular/core';
import { AgendaService } from '../../../services/agenda.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-crear-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent implements OnInit {
  fechaSeleccionada: string = this.obtenerFechaActual();
  horariosExistentes: { hora_entrada: string; hora_salida: string }[] = [];
  horariosNuevos: { hora_entrada: string; hora_salida: string }[] = [];
  idEspecialidad: number = 1; // Valor predeterminado; se actualiza dinámicamente
  agregandoHorarios: boolean = false; // Controla la visualización del formulario
  opcionesHorarios: string[] = []; // Contendrá las opciones de horario con intervalos de 30 minutos

  constructor(
    private agendaService: AgendaService,
    private authService: AuthService,
    private turnoService: TurnoService
  ) {}

  ngOnInit(): void {
    this.generarOpcionesHorarios();// Inicializa las opciones de horario
    this.cargarHorarios()
  }

  // Función para obtener la fecha actual
  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Función para generar las opciones de horarios con intervalos de 30 minutos
  generarOpcionesHorarios(): void {
    const horas = [];
    let hora = 6;  // Comenzamos a las 6 AM
    let minutos = 0;
  
    while (hora < 23) {  // Limitar hasta las 22:30 (23 sería las 11 PM)
      const horaFormateada = `${this.pad(hora)}:${this.pad(minutos)}`;
      horas.push(horaFormateada);
  
      minutos += 30;
      if (minutos === 60) {
        minutos = 0;
        hora++;
      }
    }
    this.opcionesHorarios = horas;
  }

  // Función de padding para agregar un 0 si la hora/minuto es menor a 10
  pad(valor: number): string {
    return valor.toString().padStart(2, '0');
  }

  // Cargar los horarios existentes desde el servidor
  async cargarHorarios(): Promise<void> {
    try {
      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('No se ha encontrado un ID de usuario.');
        return;
      }

      const especialidades = await firstValueFrom(this.turnoService.obtenerEspecialidadesPorMedico(userId));
      if (especialidades?.payload?.length > 0) {
        this.idEspecialidad = especialidades.payload[0].id_especialidad;
      } else {
        console.error('No se encontró especialidad para el médico.');
      }

      const response: any = await firstValueFrom(this.turnoService.obtenerAgenda(userId));
      const agendaDelDia = response.payload.filter((agenda: any) => {
        const fechaAgenda = new Date(agenda.fecha);
        return fechaAgenda.toISOString().split('T')[0] === this.fechaSeleccionada;
      });

      this.horariosExistentes = agendaDelDia.map((agenda: any) => ({
        hora_entrada: agenda.hora_entrada,
        hora_salida: agenda.hora_salida
      }));
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  }

  // Mostrar el formulario para agregar horarios
  mostrarFormulario() {
    this.agregandoHorarios = true;
    this.horariosNuevos = [{ hora_entrada: '', hora_salida: '' }];
  }

  // Agregar un nuevo horario al formulario
  agregarNuevoHorario(): void {
    this.horariosNuevos.push({ hora_entrada: '', hora_salida: '' });
  }

  // Eliminar un horario del formulario
  eliminarHorario(index: number): void {
    this.horariosNuevos.splice(index, 1);
    if (this.horariosNuevos.length === 0) {
      this.cancelarFormulario();
    }
  }

  // Cancelar el formulario de agregar horarios
  cancelarFormulario() {
    this.agregandoHorarios = false;
    this.horariosNuevos = [];
  }

  // Verificar si el horario a agregar se superpone con uno ya existente
  verificarSuperposicion(horaEntrada: string, horaSalida: string): boolean {
    return this.horariosExistentes.some(horario => {
      return !(
        horaSalida <= horario.hora_entrada || horaEntrada >= horario.hora_salida
      );
    });
  }

  // Guardar los nuevos horarios
  async guardarAgenda(): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId || this.horariosNuevos.length === 0) return;
  
    for (const horario of this.horariosNuevos) {
      if (!horario.hora_entrada || !horario.hora_salida) {
        console.error('Completa todas las horas antes de guardar.');
        alert('Completa todas las horas antes de guardar.');
        return;
      }
  
      if (horario.hora_salida <= horario.hora_entrada) {
        console.error('La hora de salida no puede ser anterior o igual a la hora de entrada.');
        alert('La hora de salida no puede ser anterior o igual a la hora de entrada.');
        return;
      }
  
      if (this.verificarSuperposicion(horario.hora_entrada, horario.hora_salida)) {
        console.error('El horario se superpone con uno existente.');
        alert('El horario se superpone con uno existente.');
        return;
      }
    }
  
    // Guardar los horarios si no hay conflictos
    this.horariosNuevos.forEach(horario => {
      const agenda = {
        id_medico: userId,
        id_especialidad: this.idEspecialidad,
        fecha: this.fechaSeleccionada,
        hora_entrada: horario.hora_entrada,
        hora_salida: horario.hora_salida
      };
  
      this.agendaService.crearAgenda(agenda).subscribe(
        () => {
          this.horariosNuevos = [];
          this.cargarHorarios();
        },
        (error) => console.error('Error al guardar la agenda:', error)
      );
    });
  }
  
}
