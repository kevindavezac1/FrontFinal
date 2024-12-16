import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/services/turno.service';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit {
  turnos: any[] = [];
  fechaSeleccionada: string = this.obtenerFechaActual();
  turnoSeleccionado: any = null;

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerTurnosProgramados();
  }

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Método para obtener turnos programados ordenados
  async obtenerTurnosProgramados(): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('No se ha encontrado un ID de usuario.');
      return;
    }
  
    try {
      const response: any = await firstValueFrom(
        this.turnoService.obtenerTurnosPorMedicoYFecha(userId, this.fechaSeleccionada)
      );
  
      if (response.payload) {
        console.log('Turnos recibidos del backend:', response.payload);
  
        // Log para verificar el formato de las horas
        response.payload.forEach((turno: any, index: number) => {
          console.log(`Turno ${index + 1} - Fecha: ${turno.fecha}, Hora: ${turno.hora}`);
        });
  
        // Aseguramos que todas las horas tengan el formato correcto (hh:mm)
        response.payload.forEach((turno: any) => {
          if (turno.hora.length < 5) {
            console.warn(
              `Formato de hora incorrecto para fecha ${turno.fecha}: ${turno.hora}. Ajustando formato...`
            );
            turno.hora = turno.hora.padStart(5, '0');
          }
        });
  
        console.log('Turnos después de ajustar el formato de horas:', response.payload);
  
        // Ordenamos cronológicamente desde la fecha seleccionada
        this.turnos = response.payload.sort((a: any, b: any) => {
          const fechaA = a.fecha.split('T')[0]; // Extraer solo la parte de la fecha
          const fechaHoraA = new Date(`${fechaA}T${a.hora}`).getTime();
        
          const fechaB = b.fecha.split('T')[0];
          const fechaHoraB = new Date(`${fechaB}T${b.hora}`).getTime();
        
          return fechaHoraA - fechaHoraB; // Ordenar de menor a mayor
        });
        
  
        console.log('Turnos ordenados cronológicamente:', this.turnos);
      } else {
        console.error('No se encontraron turnos en la respuesta.');
      }
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    }
  }
  

  // Método que se ejecuta cuando cambia la fecha seleccionada
  onFechaChange(): void {
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    this.obtenerTurnosProgramados();
  }

  // Método para alternar la visualización de notas
  toggleNotas(turno: any): void {
    this.turnoSeleccionado = this.turnoSeleccionado === turno ? null : turno;
  }

  // Método para calcular la edad con base en la fecha de nacimiento
  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fechaNacimientoDate = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    if (
      hoy.getMonth() < fechaNacimientoDate.getMonth() ||
      (hoy.getMonth() === fechaNacimientoDate.getMonth() &&
        hoy.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad--;
    }

    return edad;
  }
}
