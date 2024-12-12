import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jhosue',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './jhosue.component.html',
  styleUrl: './jhosue.component.css'
})
export class JhosueComponent {

  // Propiedades para recibir los detalles de la partida
  @Input() partidaDetalles: {
    numJugadores: number,
    numeroBarajas: number,
  } | null = null;

  // Propiedades existentes
  roomCode: string = '';
  copyMessage: string = '';
  codigoPartida: string = '';

  constructor() { }

  ngOnInit(): void {
    this.generarCodigoPartida();
    console.log('Detalles de partida recibidos:', this.partidaDetalles);
  }

  // Observa los cambios en partidaDetalles
  ngOnChanges(): void {
    if (this.partidaDetalles) {
      // Aquí puedes hacer más cosas con los detalles recibidos
      console.log('Detalles de partida recibidos:', this.partidaDetalles);
    }
  }

  generarCodigoPartida(): void {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitud = 6;
    this.roomCode = Array.from(
      { length: longitud },
      () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
  }

  // Método para copiar código
  copyRoomCode(): void {
    if (this.roomCode) {
      navigator.clipboard.writeText(this.roomCode).then(() => {
        this.copyMessage = '¡Código copiado!';

        setTimeout(() => {
          this.copyMessage = '';
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar el código', err);
        this.copyMessage = 'Error al copiar';
      });
    }
  }

}
