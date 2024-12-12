import { Component } from '@angular/core';
import { AgendaService } from '../../../services/agenda.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-crear-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent {
  fechaSeleccionada: string = this.obtenerFechaActual();
  horariosExistentes: { hora_entrada: string; hora_salida: string }[] = [];
  horariosNuevos: { hora_entrada: string; hora_salida: string }[] = [];
  idEspecialidad: number = 1;  // Valor por defecto, pero lo actualizamos al obtenerlo del médico

  constructor(
    private agendaService: AgendaService,
    private authService: AuthService,
    private turnoService: TurnoService
  ) {}

  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Este método se ejecuta al seleccionar una fecha y muestra los horarios existentes
  async cargarHorarios(): Promise<void> {
    try {
      const userId = this.authService.getUserId();
      if (userId === null) {
        console.error("No se ha encontrado un ID de usuario.");
        return;
      }

      // Obtenemos las especialidades para el médico
      const especialidades = await firstValueFrom(this.turnoService.obtenerEspecialidadesPorMedico(userId));

      // Asegúrate de acceder al id_especialidad de la respuesta
      if (especialidades && especialidades.payload && especialidades.payload.length > 0) {
        this.idEspecialidad = especialidades.payload[0].id_especialidad;  // Obtén el id_especialidad
      } else {
        console.error("No se encontró especialidad para el médico.");
      }

      // Luego, obtenemos la agenda para el médico y la fecha seleccionada
      const response: any = await firstValueFrom(
        this.turnoService.obtenerAgenda(userId)
      );

      console.log('Agenda cargada:', response);

      // Filtrar los horarios para la fecha seleccionada
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

  // Agregar un nuevo horario
  agregarNuevoHorario(): void {
    this.horariosNuevos.push({ hora_entrada: '', hora_salida: '' });
  }

  // Eliminar un horario de la lista
  eliminarHorario(index: number): void {
    this.horariosNuevos.splice(index, 1);
  }

  // Método para guardar los nuevos horarios
  guardarAgenda(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error("El usuario no está autenticado o el ID no está disponible.");
      return;
    }

    if (this.horariosNuevos.length === 0) {
      console.warn("No hay horarios nuevos para guardar.");
      return;
    }

    // Enviar los horarios nuevos al servicio de agenda
    this.horariosNuevos.forEach(horario => {
      const agenda = {
        id_medico: userId, 
        id_especialidad: this.idEspecialidad, 
        fecha: this.fechaSeleccionada,
        hora_entrada: horario.hora_entrada, 
        hora_salida: horario.hora_salida 
      };

      console.log("Datos enviados al servicio:", agenda);

      this.agendaService.crearAgenda(agenda).subscribe(
        (response) => {
          console.log('Agenda guardada:', response);
          this.horariosNuevos = [];
          // Solo llamamos a cargarHorarios una vez después de guardar
          this.cargarHorarios(); 
        },
        (error) => {
          console.error('Error al guardar la agenda:', error);
        }
      );
    });
  }
}
