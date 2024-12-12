import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
    <app-mateo-crear-partida
      (codigoGeneradoEvent)="recibirCodigoPartida($event)">
    </app-mateo-crear-partida>

    <app-jhosue
      [codigoRecibido]="codigoPartida">
    </app-jhosue>
  `
})
export class AppComponent {
  title = 'Proyecto_Grupo3';
}
