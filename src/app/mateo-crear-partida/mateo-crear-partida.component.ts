import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mateo-crear-partida',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mateo-crear-partida.component.html',
  styleUrl: './mateo-crear-partida.component.css'
})
export class MateoCrearPartidaComponent {
  // Propiedades del formulario
  numJugadores: number = 2;
  numeroBarajas: number = 2;
  codigoCopiadoMensaje: string = '';

  // Crear un EventEmitter para enviar los detalles de la partida
  @Output() partidaCreada = new EventEmitter<{
    numJugadores: number,
    numeroBarajas: number
  }>();



  calcularNumeroBarajas(): void {
    if (this.numJugadores >= 2 && this.numJugadores <= 6) {
      this.numeroBarajas = 2;
    } else if (this.numJugadores >= 7 && this.numJugadores <= 11) {
      this.numeroBarajas = 3;
    } else if (this.numJugadores >= 12 && this.numJugadores <= 18) {
      this.numeroBarajas = 4;
    } else {
      this.numJugadores = 2;
      this.numeroBarajas = 2;
    }
  }


  crearPartida(): void {
    // Emitir los detalles de la partida
    this.partidaCreada.emit({
      numJugadores: this.numJugadores,
      numeroBarajas: this.numeroBarajas,
    });

    console.log('Creando partida:', {
      jugadores: this.numJugadores,
      barajas: this.numeroBarajas,
    });

  }
}

