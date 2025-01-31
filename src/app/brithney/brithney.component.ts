// brithney.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GameService, Mesa, Jugador } from '../game.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-brithney',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './brithney.component.html',
  styleUrl: './brithney.component.css'
})
export class BrithneyComponent implements OnInit, OnDestroy {
  columnas: string[] = [];
  mesa: Mesa | null = null;
  partidaId: string | null = null;
  private subscriptions: Subscription[] = [];
  filas = [
    { nombre: '1/3', valores: [] as string[] },
    { nombre: '2/3', valores: [] as string[] },
    { nombre: '1/4', valores: [] as string[] },
    { nombre: '2/4', valores: [] as string[] },
    { nombre: '1/5', valores: [] as string[] },
    { nombre: '2/5', valores: [] as string[] },
    { nombre: 'Escalera', valores: [] as string[] },
  ];

  constructor(
    private gameService: GameService,
    private websocketService: WebsocketService,
    private router: Router
  ) { }

  ngOnInit() {
    // Nos suscribimos a los cambios de la mesa actual
    this.subscriptions.push(
      this.gameService.mesaActual$.subscribe(mesa => {
        if (mesa) {
          this.mesa = mesa;
          this.initializeTableData(mesa);
        }
      })
    );

    // Nos suscribimos a los cambios de la partida actual
    this.subscriptions.push(
      this.gameService.partidaActual$.subscribe(partida => {
        if (partida) {
          this.partidaId = partida.id || null;
        }
      })
    );

    // Suscribirse a las actualizaciones de la tabla
    this.subscriptions.push(
      this.websocketService.getTableUpdates().subscribe(update => {
        if (update && update.type === 'table_updated') {
          console.log('Actualización de tabla recibida:', update);
          this.filas[update.rowIndex].valores[update.colIndex] = update.value;
        }
      })
    );

    // Si no hay mesa actual, intentamos cargarla del state
    if (!this.mesa) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        const mesaId = navigation.extras.state['mesaId'];
        if (mesaId) {
          this.loadMesaData(mesaId);
        } else {
          console.warn('No se encontró ID de mesa');
          this.router.navigate(['/']);
        }
      } else {
        console.warn('No hay estado de navegación');
        this.router.navigate(['/']);
      }
    }
  }

  onInputChange(event: Event, i: number, j: number) {
    const target = event.target as HTMLInputElement; // Asegura que el target es un HTMLInputElement
    const value = target.value; // Extrae el valor del input
    this.updateCellValue(i, j, value); // Llama al método updateCellValue con los valores
  }

  // Actualizar el valor de una celda y notificar a los demás jugadores
  updateCellValue(i: number, j: number, value: string) {
    if (!this.mesa?.id) return;
    // Actualizar el valor en la tabla local
    this.filas[i].valores[j] = value;
    // Enviar la actualización al servidor WebSocket
    this.websocketService.sendTableUpdate(this.mesa.id, i, j, value);
  }


  private loadMesaData(mesaId: string) {
    this.subscriptions.push(
      this.gameService.getMesaById(mesaId).subscribe({
        next: (mesa) => {
          this.gameService.setMesaActual(mesa);
        },
        error: (error) => {
          console.error('Error al obtener la mesa:', error);
          this.router.navigate(['/']);
        }
      })
    );
  }

  private initializeTableData(mesa: Mesa) {
    if (!mesa.jugadores) return;
    // Convertir el objeto de jugadores a un array ordenado
    const jugadoresArray = Object.values(mesa.jugadores);
    // Extraer los nombres de los jugadores
    this.columnas = jugadoresArray.map(jugador => jugador.nombre);
    console.log('Nombres de jugadores extraídos:', this.columnas);
    // Inicializar los valores vacíos para cada jugador
    this.filas.forEach(fila => {
      // Asegurarnos de que tengamos el número correcto de columnas
      fila.valores = new Array(mesa.cant_jugadores).fill('');
    });
    console.log('Filas inicializadas con', mesa.cant_jugadores, 'columnas');
  }

  ngOnDestroy() {
    // Limpiamos todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // El resto de los métodos permanecen igual...
  getSumaColumna(columnaIndex: number): number {
    return this.filas.reduce((sum, fila) => {
      const valor = parseFloat(fila.valores[columnaIndex]);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
  }

  preventEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  getColumnClass(index: number): string {
    const colors = ['custom-bg-1', 'custom-bg-2', 'custom-bg-3', 'custom-bg-4'];
    return colors[index % colors.length];
  }

  validateNonNegative(event: Event, i: number, j: number): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (value <= 0) {
      this.showAlert();
      input.value = '';
      this.filas[i].valores[j] = '';
    }
  }

  showAlert(): void {
    const modal = document.getElementById('alertModal')!;
    modal.style.display = 'block';
  }

  closeModal(): void {
    const modal = document.getElementById('alertModal')!;
    modal.style.display = 'none';
  }
}
