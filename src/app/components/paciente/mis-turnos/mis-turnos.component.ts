import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
})
export class MisTurnosComponent implements OnInit {
  turnos: any[] = [];
  turnoSeleccionado: any | null = null;

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  async cargarTurnos(): Promise<void> {
    const usuarioId = this.authService.getUserId();
    if (usuarioId === null) {
      console.error('El ID del usuario es null. No se pueden cargar los turnos.');
      return;
    }
  
    try {
      const response: any = await firstValueFrom(this.turnoService.obtenerTurnoPaciente(usuarioId));
      if (response.codigo === 200) {
  
        // Aseguramos que todas las horas tengan el formato correcto
        response.payload.forEach((turno: any) => {
          if (turno.hora.length < 5) {
            turno.hora = turno.hora.padStart(5, '0'); // Añade ceros a la izquierda si es necesario
          }
        });
  
        // Filtramos los turnos que ya han pasado
        const now = new Date().getTime();
        this.turnos = response.payload.filter((turno: any) => {
          const fechaHoraTurno = new Date(`${turno.fecha.split('T')[0]}T${turno.hora}`).getTime();
          return fechaHoraTurno >= now;
        });
  
        // Ordenamos los turnos por fecha y hora
        this.turnos.sort((a: any, b: any) => {
          const fechaHoraA = new Date(`${a.fecha.split('T')[0]}T${a.hora}`).getTime();
          const fechaHoraB = new Date(`${b.fecha.split('T')[0]}T${b.hora}`).getTime();

          return fechaHoraA - fechaHoraB;
        });
  
      } else {
        console.error(response.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar los turnos:', error);
    }
  }
  
  
  

  mostrarDetalles(turno: any): void {
    if (this.turnoSeleccionado === turno) {
      this.turnoSeleccionado = null; // Cierra si es el mismo turno
    } else {
      this.turnoSeleccionado = turno; // Muestra el turno seleccionado
    }
  }

  cerrarDetalles(): void {
    this.turnoSeleccionado = null;
  }
}
