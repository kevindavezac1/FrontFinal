// gestion-cobertura.component.ts
import { Component, OnInit } from '@angular/core';
import { CoberturaService } from '../../../services/cobertura.service';

@Component({
  selector: 'app-gestion-cobertura',
  templateUrl: './gestion-coberturas.component.html',
  styleUrls: ['./gestion-coberturas.component.css']
})
export class GestionCoberturasComponent implements OnInit {
  coberturas: any[] = [];
  nuevaCobertura: any = { nombre: '' };
  coberturaSeleccionada: any = null;

  constructor(private coberturaService: CoberturaService) {}

  ngOnInit(): void {
    this.obtenerCoberturas();
  }

  obtenerCoberturas(): void {
    this.coberturaService.getCoberturas().subscribe((data) => {
      this.coberturas = data;
    });
  }

  agregarCobertura(): void {
    this.coberturaService.createCobertura(this.nuevaCobertura).subscribe(() => {
      this.obtenerCoberturas();
      this.nuevaCobertura = { nombre: '' };
    });
  }

  seleccionarCobertura(cobertura: any): void {
    this.coberturaSeleccionada = { ...cobertura };
  }

  actualizarCobertura(): void {
    if (this.coberturaSeleccionada) {
      this.coberturaService.updateCobertura(this.coberturaSeleccionada.id, this.coberturaSeleccionada).subscribe(() => {
        this.obtenerCoberturas();
        this.coberturaSeleccionada = null;
      });
    }
  }

  eliminarCobertura(id: number): void {
    console.log('Intentando eliminar cobertura con ID:', id); // Agregar log aquí
    this.coberturaService.deleteCobertura(id).subscribe({
      next: (data) => {
        console.log('Respuesta del backend al eliminar cobertura:', data); // Ver la respuesta del backend
        this.obtenerCoberturas(); // Actualiza la lista de coberturas después de eliminar una
      },
      error: (error) => {
        console.error('Error al eliminar cobertura:', error); // Log para depuración
        alert('No se puede eliminar la cobertura porque está asociada a un usuario.');
      },
      complete: () => {
        console.log('Eliminación de cobertura completada');
        alert('Eliminación de cobertura completada');
      }
    });
  }
  
}