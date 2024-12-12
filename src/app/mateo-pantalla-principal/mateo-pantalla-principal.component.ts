import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mateo-pantalla-principal',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './mateo-pantalla-principal.component.html',
  styleUrl: './mateo-pantalla-principal.component.css'
})
export class MateoPantallaPrincipalComponent {
  crearPartida() {
    console.log('Crear Partida clickeado');
    // Implementa la lógica para crear una partida
  }

  unirsePartida() {
    console.log('Unirse a Partida clickeado');
    // Implementa la lógica para unirse a una partida
  }
}
