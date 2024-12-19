import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../../../services/especialidad.service';
@Component({
  selector: 'app-gestion-especialidad',
  templateUrl: './gestion-especialidad.component.html',
  styleUrls: ['./gestion-especialidad.component.css']
})
export class GestionEspecialidadesComponent implements OnInit {
  especialidades: any[] = [];
  nuevaEspecialidad: any = { descripcion: '' };
  especialidadSeleccionada: any = null;
  router: any;
  constructor(private especialidadService : EspecialidadService) {}
  ngOnInit(): void {
    this.obtenerEspecialidades();
  }
  obtenerEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
    });
  }
  agregarEspecialidad(): void {
    this.especialidadService.createEspecialidad(this.nuevaEspecialidad).subscribe(() => {
      this.obtenerEspecialidades();
      this.nuevaEspecialidad = { descripcion: '' };
    });
  }
  seleccionarEspecialidad(especialidad: any): void {
    this.especialidadSeleccionada = { ...especialidad };
  }
  actualizarEspecialidad(): void {
    if (this.especialidadSeleccionada) {
      this.especialidadService.updateEspecialidad(this.especialidadSeleccionada.id, this.especialidadSeleccionada).subscribe(() => {
        this.obtenerEspecialidades();
        this.especialidadSeleccionada = null;
      });
    }
  }
  eliminarEspecialidad(id: number): void {
    this.especialidadService.deleteEspecialidad(id).subscribe({
      next: () => {
        this.obtenerEspecialidades();
      },
      error: (error) => {
        console.error('Error al eliminar especialidad:', error);
        alert('No se puede eliminar la especialidad porque está asociada a un médico.');
      },
      complete: () => {
        console.log('Eliminación de especialidad completada');
        alert('Eliminación de especialidad completada');
      }
    });
  }
}