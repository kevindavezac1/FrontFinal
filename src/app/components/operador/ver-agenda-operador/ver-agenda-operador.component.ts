import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TurnoService } from 'src/app/services/turno.service';
import { TurnosProgramadosComponent } from '../../medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from '../../medico/gestion-agenda/gestion-agenda.component';
import { AsignarTurnosOperadorComponent } from '../aignar-turnos-operador/asignar-turnos-operador.component';

export interface operadorGestionMedico {
  nombre: string;
  especialidad: string;
  horarioatencion: string;
}
const idsMedicos = [30, 37];


@Component({
  selector: 'app-ver-agenda-operador',
  templateUrl: './ver-agenda-operador.component.html',
  styleUrls: ['./ver-agenda-operador.component.css']
})

 
export class VerAgendaOperadorComponent {
  displayedColumns: string[] = ['nombre', 'especialidad', 'horarioatencion', 'acciones'];
  dataSource: operadorGestionMedico[] = [];
  fechaForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private turnoService:TurnoService
  ) {
    this.fechaForm = this.fb.group({
      fecha: [new Date()]
    });
    
  }

   ngOnInit(): void{
     this.cargarTurnos();
  }

  
  cargarTurnos(): void {
    this.dataSource = [...this.dataSource];
    const fechaSeleccionada = this.fechaForm.get('fecha')?.value;
    console.log('Fecha seleccionada:', fechaSeleccionada);
    if (fechaSeleccionada) {
      const fechaString = fechaSeleccionada.toISOString().split('T')[0];
      console.log('Fecha en formato ISO:', fechaString);
      idsMedicos.forEach((id_medico) => {
        this.turnoService.obtenerTurnosPorMedicoYFecha(id_medico, fechaString).subscribe(
          (response) => {
            console.log(`Respuesta para el médico ${id_medico}:`, response);
            if (response && Array.isArray(response.payload)) {
              const turnosMedico = response.payload.map((turno: any) => ({
                nombre: turno.nombre_medico,
                especialidad: turno.especialidad,
                horarioatencion: turno.hora,
              }));
              this.dataSource = [...this.dataSource, ...turnosMedico];
            } else {
              console.error(`Respuesta inesperada:`, response);
            }
          },
          (error) => console.error(`Error al cargar turnos del médico ${id_medico}`, error)
        );
      });
    }
  }
  

 
  onFechaChange(): void {
    this.cargarTurnos();
  }

  modificarHorarios(doctor: any) {
    const dialogRef = this.dialog.open(GestionAgendaComponent, {
      width: 'auto',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: { horarios: { entrada: '09:00', salida: '17:00' } } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Nuevo horario guardado:', result);
      }
    });
  }

  agregarTurnos(doctor: any) {
    const dialogRef = this.dialog.open(AsignarTurnosOperadorComponent, {
      width: '800px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Nuevo horario guardado:', result);
      }
    });
  }

  verTurnosConfirmados(doctor: any) {
    const dialogRef = this.dialog.open(TurnosProgramadosComponent, {
      width: '800px',
      height: '700px',
    });
  }

  cancelarTurnos(doctor : any){
    const dialogRef = this.dialog.open(TurnosProgramadosComponent);
  }
}

