import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mateo-crear-partida',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './mateo-crear-partida.component.html',
  styleUrl: './mateo-crear-partida.component.css'
})
export class MateoCrearPartidaComponent implements OnInit {
  // Propiedades del formulario
  numJugadores: number = 2;
  numeroBarajas: number = 2;
  dificultad: string = 'medio';
  codigoPartida: string = '';
  codigoCopiadoMensaje: string = '';

  constructor() { }

  ngOnInit(): void {
    // Generar código de partida al inicializar
    this.generarCodigoPartida();
  }

  // Calcular número de barajas según número de jugadores
  calcularNumeroBarajas(): void {
    if (this.numJugadores >= 2 && this.numJugadores <= 6) {
      this.numeroBarajas = 2;
    } else if (this.numJugadores >= 7 && this.numJugadores <= 11) {
      this.numeroBarajas = 3;
    } else if (this.numJugadores >= 12 && this.numJugadores <= 18) {
      this.numeroBarajas = 4;
    } else {
      // Resetear a valores por defecto si está fuera de rango
      this.numJugadores = 2;
      this.numeroBarajas = 2;
    }
  }

  // Generar código aleatorio para la partida
  generarCodigoPartida(): void {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitud = 6;

    this.codigoPartida = Array.from(
      { length: longitud },
      () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
  }

  // Copiar código de partida al portapapeles
  copiarCodigoPartida(): void {
    navigator.clipboard.writeText(this.codigoPartida).then(() => {
      this.codigoCopiadoMensaje = '¡Código copiado!';

      // Resetear mensaje después de 2 segundos
      setTimeout(() => {
        this.codigoCopiadoMensaje = '';
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar el código', err);
      this.codigoCopiadoMensaje = 'Error al copiar';
    });
  }

  // Método para crear la partida
  crearPartida(): void {
    // Lógica para crear la partida
    console.log('Creando partida:', {
      jugadores: this.numJugadores,
      barajas: this.numeroBarajas,
      dificultad: this.dificultad,
      codigo: this.codigoPartida
    });

    // Aquí iría la lógica para enviar los datos al servicio backend
  }
}
