// jhosue.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService, Usuario } from '../user.service';
import { GameService, Mesa, Partida, Jugador } from '../game.service';
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
  numeroBarajas: number = 2; // Siempre será 2 barajas
  mesaActual: Mesa | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  private subscriptions: Subscription[] = [];
  esCreador: boolean = false;

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
      // Set esCreador based on the state
      this.esCreador = state.detallesPartida.esCreador || false;
    } else {
      this.router.navigate(['/crear-partida']);
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.usuario$.subscribe(usuario => {
        this.usuario = usuario;
        if (!usuario) {
          this.router.navigate(['/']);
          return;
        }
      })
    );

    if (this.mesaActual?.id) {
      this.subscribeToMesaUpdates();
    }
  }

  private loadMesaDetails(detalles: any): void {
    if (!detalles) return;

    this.numJugadores = detalles.numJugadores;
    this.numeroBarajas = 2; // Siempre 2 barajas
    this.roomCode = detalles.codigoSala;

    if (detalles.mesaId) {
      this.loadMesaData(detalles.mesaId);
    }
  }


  private async loadMesaData(mesaId: string): Promise<void> {
    try {
      const mesa = await this.gameService.getMesaById(mesaId).toPromise();
      if (mesa) {
        this.mesaActual = mesa;
        this.gameService.setMesaActual(mesa);
        // Check if current user is creator
        const currentUser = this.userService.getUsuario();
        if (currentUser && mesa.creador_id === currentUser.name) {
          this.esCreador = true;
        }
        this.subscribeToMesaUpdates();
      }
    } catch (error) {
      console.error('Error al cargar los datos de la mesa:', error);
      this.errorMessage = 'Error al cargar los datos de la sala';
    }
  }


  private subscribeToMesaUpdates(): void {
    if (!this.mesaActual?.id) return;

    this.websocketService.connectToMesa(this.mesaActual.id);

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

  volverAlInicio(): void {
    const jugadorId = 'ID_DEL_JUGADOR'; // Reemplaza con el ID real del jugador
    const mesaId = 'ID_DE_LA_MESA'; // Reemplaza con el ID real de la mesa

    // Notificar al servidor que el jugador ha abandonado la mesa
    this.websocketService.sendPlayerLeft(mesaId, jugadorId);

    // Redirigir al jugador a la pantalla de inicio
    this.router.navigate(['/home']);
  }


  // jhosue.component.ts
  async iniciarPartida() {
    if (!this.mesaActual?.id || !this.usuario) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Preparar los jugadores para la partida
      const jugadores = Object.values(this.mesaActual.jugadores).map(jugador => ({
        id: jugador.id,
        nombre: jugador.nombre
      }));

      // Crear la partida con la nueva estructura
      const partidaData = {
        id_mesa: this.mesaActual.id,
        jugadores: jugadores
      };

      const partida = await this.gameService.createPartida(partidaData).toPromise();

      if (partida) {
        // Actualizar el estado de la mesa a "en_curso"
        await this.gameService.updateMesaEstado(this.mesaActual.id, 'en_curso').toPromise();

        // Notificar a todos los jugadores que el juego ha comenzado
        this.websocketService.joinMesa(this.mesaActual.id, { id: this.usuario.name, nombre: this.usuario.name });
        this.websocketService.sendStartGame(this.mesaActual.id);

        // Obtener la mesa actualizada
        const mesaActualizada = await this.gameService.getMesaById(this.mesaActual.id).toPromise();

        if (mesaActualizada) {
          // Actualizar la mesa en el GameService
          this.gameService.setMesaActual(mesaActualizada);

          // Navegar a la tabla con los datos actualizados
          this.router.navigate(['/tabla'], {
            state: {
              partidaId: partida.id,
              mesaId: this.mesaActual.id,
              jugadores: mesaActualizada.jugadores,
              estado: mesaActualizada.estado
            }
          });
        }
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
