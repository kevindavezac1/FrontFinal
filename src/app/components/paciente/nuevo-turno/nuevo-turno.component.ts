// src/app/components/nuevo-turno/nuevo-turno.component.ts
import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { lastValueFrom } from 'rxjs';
import { Especialidad } from '../../interfaces/especialidad.interface';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  especialidades: Especialidad[] = [];  // esta lista esta bien
  // medicos: any[] = [];        
  // horasDisponibles: string[] = []; 
  // especialidadSeleccionada: any = null;  
  // medicoSeleccionado: any = null;     
  // horaSeleccionada: string = '';     

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.cargarEspecialidades();  
  
  }

  async cargarEspecialidades(): Promise<void> {
    try {
      const response = await lastValueFrom(this.turnoService.obtenerEspecialidades());
  
      if (response.codigo === 200) {
        console.log('Especialidades cargadas:', response.payload);
        this.especialidades = response.payload as Especialidad[];
      } else {
        console.error('Error al obtener especialidades:', response.mensaje);
        alert('No se pudieron cargar las especialidades. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error);
      alert('Ocurrió un error al intentar cargar las especialidades.');
    }
  }

  // async cargarMedicopoEspecialidad(){
  //   try{
  //     const response = await lastValueFrom(this.turnoService.obtenerMedicoPorEspecialidad())

  //   }
  // }

}