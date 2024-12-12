import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MateoCrearPartidaComponent } from './mateo-crear-partida/mateo-crear-partida.component';
import { JhosueComponent } from './jhosue/jhosue.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
    <app-mateo-crear-partida (partidaCreada)="onPartidaCreada($event)"></app-mateo-crear-partida>
    <app-jhosue [partidaDetalles]="detallesPartida"></app-jhosue>
  `
})
export class AppComponent {
  title = 'Proyecto_Grupo3';

  detallesPartida: {
    numJugadores: number,
    numeroBarajas: number,
    dificultad: string,
    codigoPartida: string
  } | null = null;

  onPartidaCreada(detalles: {
    numJugadores: number,
    numeroBarajas: number,
    dificultad: string,
    codigoPartida: string
  }) {
    this.detallesPartida = detalles;
  }
}
