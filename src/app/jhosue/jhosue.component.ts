// jhosue.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService, Usuario } from '../user.service';
import { GameService, Mesa, Partida, Jugador, JugadorPartida } from '../game.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-jhosue',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './jhosue.component.html',
  styleUrl: './jhosue.component.css'
})
export class JhosueComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  roomCode: string = '';
  copyMessage: string = '';
  numJugadores: number = 0;
  numeroBarajas: number = 0;
  mesaActual: Mesa | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  private subscriptions: Subscription[] = [];

  get jugadoresConectados(): Jugador[] {
    if (!this.mesaActual?.jugadores) return [];
    return Object.values(this.mesaActual.jugadores);
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private gameService: GameService,
    private websocketService: WebsocketService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { detallesPartida: any };
      this.loadMesaDetails(state.detallesPartida);
    } else {
      this.router.navigate(['/crear-partida']);
    }
  }

  ngOnInit(): void {
    // Suscripción al usuario
    this.subscriptions.push(
      this.userService.usuario$.subscribe(usuario => {
        this.usuario = usuario;
        if (!usuario) {
          this.router.navigate(['/']);
          return;
        }
      })
    );

    // Si tenemos mesaId, iniciar la suscripción a actualizaciones
    if (this.mesaActual?.id) {
      this.subscribeToMesaUpdates();
    }
  }

  private loadMesaDetails(detalles: any): void {
    if (!detalles) return;

    this.numJugadores = detalles.numJugadores;
    this.numeroBarajas = detalles.numeroBarajas;
    this.roomCode = detalles.codigoSala;

    // Cargar los datos actuales de la mesa
    if (detalles.mesaId) {
      this.loadMesaData(detalles.mesaId);
    }
  }

  private async loadMesaData(mesaId: string): Promise<void> {
    try {
      const mesa = await this.gameService.getMesaById(mesaId).toPromise();
      if (mesa) {
        this.mesaActual = mesa;
        // Iniciar la suscripción WebSocket después de cargar los datos iniciales
        this.subscribeToMesaUpdates();
      }
    } catch (error) {
      console.error('Error al cargar los datos de la mesa:', error);
      this.errorMessage = 'Error al cargar los datos de la sala';
    }
  }

  private subscribeToMesaUpdates(): void {
    if (!this.mesaActual?.id) return;

    // Conectar al WebSocket
    this.websocketService.connectToMesa(this.mesaActual.id);

    // Suscribirse a actualizaciones
    this.subscriptions.push(
      this.websocketService.getMesaUpdates().subscribe({
        next: (mesa) => {
          if (mesa) {
            console.log('Actualización de mesa recibida:', mesa);
            this.mesaActual = mesa;
          }
        },
        error: (error) => {
          console.error('Error en la conexión WebSocket:', error);
          this.errorMessage = 'Error en la conexión. Por favor, recarga la página.';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.websocketService.disconnect();
  }


  async iniciarPartida() {
    if (!this.mesaActual?.id || !this.usuario) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const jugadoresData: { [key: string]: JugadorPartida } = {};

      Object.values(this.mesaActual.jugadores).forEach(jugador => {
        jugadoresData[jugador.id] = {
          nombre: jugador.nombre,
          puntuacion_total: 0,
          rondas: {
            '1/3': { valores: ['', '', '', ''], puntuacion: 0 },
            '2/3': { valores: ['', '', '', ''], puntuacion: 0 },
            '1/4': { valores: ['', '', '', ''], puntuacion: 0 },
            '2/4': { valores: ['', '', '', ''], puntuacion: 0 },
            '1/5': { valores: ['', '', '', ''], puntuacion: 0 },
            '2/5': { valores: ['', '', '', ''], puntuacion: 0 },
            'Escalera': { valores: ['', '', '', ''], puntuacion: 0 }
          }
        };
      });

      const partidaData: Partial<Partida> = {
        id_mesa: this.mesaActual.id,
        estado: 'en_curso',
        jugadores: jugadoresData
      };

      const partida = await this.gameService.createPartida(partidaData).toPromise();
      if (partida) {
        await this.gameService.updateMesaEstado(this.mesaActual.id, 'en_curso').toPromise();
        this.router.navigate(['/tabla'], {
          state: {
            partidaId: partida.id,
            mesaId: this.mesaActual.id
          }
        });
      }
    } catch (error) {
      console.error('Error al crear la partida:', error);
      this.errorMessage = 'Error al iniciar la partida. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

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
