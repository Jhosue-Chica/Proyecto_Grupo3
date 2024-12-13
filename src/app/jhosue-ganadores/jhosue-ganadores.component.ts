import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Jugador {
  id: string;
  nombre: string;
  avatar: string;
  puntaje: number;
  tiempoDeJuego: string;
  posicion?: number;
}

@Component({
  selector: 'app-jhosue-ganadores',
  imports: [],
  templateUrl: './jhosue-ganadores.component.html',
  styleUrl: './jhosue-ganadores.component.css'
})


export class JhosueGanadoresComponent implements OnInit {
  // Arreglo de jugadores
  jugadores: Jugador[] = [];

  // Propiedades para los primeros tres lugares
  primerLugar: Jugador | null = null;
  segundoLugar: Jugador | null = null;
  tercerLugar: Jugador | null = null;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simular obtención de datos de jugadores (reemplazar con servicio real)
    this.obtenerResultadosDelJuego();
  }

  // Método para obtener resultados del juego
  obtenerResultadosDelJuego(): void {
    // En un escenario real, esto vendría de un servicio o API
    this.jugadores = [
      {
        id: '1',
        nombre: 'Jugador 1',
        avatar: '/jhosue/avatares1.png',
        puntaje: 450,
        tiempoDeJuego: '45:23'
      },
      {
        id: '2',
        nombre: 'Jugador 2',
        avatar: '/jhosue/avatares2.png',
        puntaje: 350,
        tiempoDeJuego: '47:56'
      },
      {
        id: '3',
        nombre: 'Jugador 3',
        avatar: '/jhosue/avatares3.png',
        puntaje: 250,
        tiempoDeJuego: '52:14'
      }
    ];

    // Ordenar jugadores por puntaje
    this.jugadores.sort((a, b) => b.puntaje - a.puntaje);

    // Asignar posiciones en el podio
    this.primerLugar = this.jugadores[0];
    this.segundoLugar = this.jugadores[1];
    this.tercerLugar = this.jugadores[2];

    // Añadir posición a cada jugador
    this.jugadores.forEach((jugador, index) => {
      jugador.posicion = index + 1;
    });
  }

  // Método para compartir resultados
  shareResults(): void {
    // Generar texto para compartir
    const resultadosTexto = this.jugadores.map(jugador =>
      `${jugador.posicion}. ${jugador.nombre}: ${jugador.puntaje} puntos`
    ).join('\n');

    // Intentar usar la API de Web Share si está disponible
    if (navigator.share) {
      navigator.share({
        title: 'Resultados de Telefunken',
        text: `Resultados del juego:\n\n${resultadosTexto}`
      }).catch(console.error);
    } else {
      // Fallback para copiar al portapapeles
      this.copiarAlPortapapeles(resultadosTexto);
    }
  }

  // Método para copiar resultados al portapapeles
  private copiarAlPortapapeles(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert('Resultados copiados al portapapeles');
    }).catch(err => {
      console.error('Error al copiar', err);
    });
  }

  // Método para volver a la pantalla de inicio
  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  // Método para generar un PDF de resultados (opcional)
  generarPDFResultados(): void {
    // Implementación de generación de PDF
    // Requeriría una librería como jspdf
    console.log('Generando PDF de resultados');
  }
}
