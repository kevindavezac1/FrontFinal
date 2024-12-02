import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../components/interfaces/usuario.interface';

@Component({
  selector: 'app-dialogo-editar-usuario',
  templateUrl: './dialog-editar-usuario.component.html',
  styleUrls: ['./dialog-editar-usuario.component.css']
})
export class DialogoEditarUsuarioComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario
  ) {}

  guardarCambios(): void {
    this.dialogRef.close(this.usuario); // Retorna el usuario actualizado al componente padre
  }
}
