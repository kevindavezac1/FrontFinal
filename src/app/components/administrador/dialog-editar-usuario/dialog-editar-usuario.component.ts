import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../components/interfaces/usuario.interface';
import { CoberturaService } from 'src/app/services/cobertura.service';
import { firstValueFrom } from 'rxjs';
import { Cobertura } from '../../interfaces/cobertura.interface';

@Component({
  selector: 'app-dialogo-editar-usuario',
  templateUrl: './dialog-editar-usuario.component.html',
  styleUrls: ['./dialog-editar-usuario.component.css']
})
export class DialogoEditarUsuarioComponent implements OnInit {
  coberturas: Cobertura[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
    private coberturaService: CoberturaService
  ) {}

  async ngOnInit() {
    await this.cargarCoberturas();
  }

  async cargarCoberturas() {
    try {
      const data: any = await firstValueFrom(this.coberturaService.getCoberturas());
      this.coberturas = data || [];
    } catch (error) {
      console.error('Error al cargar coberturas:', error);
    }
  }

  guardarCambios(): void {
    this.dialogRef.close(this.usuario); // Retorna el usuario actualizado al componente padre
  }
}