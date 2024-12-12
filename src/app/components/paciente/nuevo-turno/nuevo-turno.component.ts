import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../../../services/turno.service';
import { CoberturaService } from '../../../services/cobertura.service';
import { Especialidad } from '../../interfaces/especialidad.interface';
import { Medico } from '../../interfaces/medico.interface';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';

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
  horasValidas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private coberturaService: CoberturaService,
    private authService: AuthService
  ) {
    this.formulario = this.fb.group({
      cobertura: [{ value: '', disabled: true }, Validators.required],
      especialidad: ['', Validators.required],
      id_agenda: ['', Validators.required], // Cambiado a id_agenda
      fecha: ['', [Validators.required, this.fechaValidator.bind(this)]],
      hora: ['', [Validators.required, this.horaValidator.bind(this)]],
      notas: ['', Validators.required],
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.generarHorasValidas();
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
      const response = await firstValueFrom(this.coberturaService.getCoberturaDelUsuario(id));
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
      const response = await firstValueFrom(this.turnoService.obtenerEspecialidades());
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
    this.turnoService.obtenerMedicosPorEspecialidad(especialidadId).subscribe(
      (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload;
        } else {
          alert('No se pudieron cargar los médicos. Intenta nuevamente.');
        }
      },
      (error) => {
        alert('Ocurrió un error al intentar cargar los médicos.');
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

  generarHorasValidas(): void {
    const horas = [];
    for (let i = 9; i <= 18; i++) {
      const hora = i < 10 ? `0${i}` : `${i}`;
      horas.push(`${hora}:00`);
      if (i < 18) {
        horas.push(`${hora}:30`);
      }
    }
    this.horasValidas = horas;
  }

  async crearTurno(): Promise<void> {
    if (this.formulario.valid) {
      const turno = {
        nota: this.formulario.value.notas,
        id_agenda: this.formulario.value.id_agenda, // Cambiado a id_agenda
        fecha: this.formulario.value.fecha,
        hora: this.formulario.value.hora,
        id_paciente: this.authService.getUserId(),
        id_cobertura: this.cobertura.id,
      };

      try {
        const response = await firstValueFrom(this.turnoService.crearTurno(turno));
        if (response.codigo === 200) {
          console.log('Turno creado con éxito:', response);
        } else {
          alert('Error al crear el turno: ' + response.mensaje);
        }
      } catch (error) {
        alert('Ocurrió un error al intentar crear el turno.');
      }
    } else {
      alert('Por favor completa todos los campos requeridos.');
    }
  }

  cancelar(): void {
    console.log('Formulario cancelado');
  }
}