import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../../../services/turno.service';
import { CoberturaService } from '../../../services/cobertura.service';
import { Especialidad } from '../../interfaces/especialidad.interface';
import { Medico } from '../../interfaces/medico.interface';
import { AuthService } from '../../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  cobertura: any = null;
  formulario: FormGroup;
  especialidadSeleccionada: Especialidad | null = null;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private coberturaService: CoberturaService,
    private authService: AuthService
  ) {
    this.formulario = this.fb.group({
      cobertura: [{ value: '', disabled: true }, Validators.required],
      especialidad: ['', Validators.required],
      medico: ['', Validators.required],
      fecha: ['', [Validators.required, this.fechaValidator.bind(this)]],
      hora: ['', [Validators.required, this.horaValidator.bind(this)]],
      notas: ['', Validators.required],
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.cargarCobertura(userId);
      this.cargarEspecialidades();
    } else {
      alert('No se pudo obtener el ID del usuario');
    }

    this.formulario.controls['especialidad'].valueChanges.subscribe((especialidadId) => {
      if (especialidadId) {
        this.cargarMedicos(especialidadId);
      } else {
        this.medicos = [];
      }
    });
  }

  async cargarCobertura(id: number): Promise<void> {
    try {
      const response = await lastValueFrom(this.coberturaService.getCoberturaDelUsuario(id));
      if (response && response.codigo === 200) {
        this.cobertura = response.payload;
        this.formulario.controls['cobertura'].setValue(this.cobertura.nombre);
      } else {
        alert('No se pudo cargar la cobertura del usuario.');
      }
    } catch (error) {
      alert('Ocurrió un error al intentar cargar la cobertura del usuario.');
    }
  }

  async cargarEspecialidades(): Promise<void> {
    try {
      const response = await lastValueFrom(this.turnoService.obtenerEspecialidades());
      if (response.codigo === 200) {
        this.especialidades = response.payload;
      } else {
        alert('No se pudieron cargar las especialidades. Intenta nuevamente.');
      }
    } catch (error) {
      alert('Ocurrió un error al intentar cargar las especialidades.');
    }
  }

  cargarMedicos(especialidadId: number): void {
    console.log('Especialidad seleccionada:', especialidadId); // Verifica el ID de la especialidad
    this.turnoService.obtenerMedicosPorEspecialidad(especialidadId).subscribe(
      (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload;
          console.log('Médicos cargados:', this.medicos); // Verifica los médicos cargados
        } else {
          alert('No se pudieron cargar los médicos. Intenta nuevamente.');
        }
      },
      (error) => {
        alert('Ocurrió un error al intentar cargar los médicos.');
        console.error('Error en la solicitud HTTP:', error); // Log para depuración
      }
    );
  }

  fechaValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (selectedDate < today) {
      return { 'fechaInvalida': true };
    }
    return null;
  }

  horaValidator(control: any): { [key: string]: boolean } | null {
    const selectedTime = control.value;
    if (selectedTime < '09:00' || selectedTime > '18:00') {
      return { 'horaInvalida': true };
    }
    return null;
  }

  formularioValido(): boolean {
    return this.formulario.valid;
  }

  crearTurno(): void {
    if (this.formularioValido()) {
        const turno = {
            nota: this.formulario.value.notas,
            id_medico: this.formulario.value.medico,
            fecha: this.formulario.value.fecha,
            hora: this.formulario.value.hora,
            id_paciente: this.authService.getUserId(),
            id_cobertura: this.cobertura.id
        };

        console.log('Datos del turno a enviar:', turno); // Log para depuración

        this.turnoService.crearTurno(turno).subscribe(
            (response: any) => {
                if (response.codigo === 200) {
                    console.log('Turno creado con éxito', response);
                } else {
                    alert('Error al crear el turno: ' + response.mensaje);
                }
            },
            (error) => {
                alert('Ocurrió un error al intentar crear el turno.');
                console.error('Error en la solicitud HTTP:', error); // Log para depuración
            }
        );
    } else {
        alert('Por favor completa todos los campos requeridos.');
    }
}

  cancelar(): void {
    console.log('Formulario cancelado');
  }
}