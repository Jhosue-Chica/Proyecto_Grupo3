// websocket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { Mesa, Jugador } from './game.service';
import { retryWhen, delayWhen } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private mesaSubject = new BehaviorSubject<Mesa | null>(null);
  private tableUpdateSubject = new BehaviorSubject<any>(null); // Para actualizaciones de la tabla
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private wsUrl = environment.wsUrl;

  constructor(private router: Router) {}

  connectToMesa(mesaId: string) {
    if (this.socket) {
      this.socket.close();
    }
    this.initializeWebSocket(mesaId);
  }

  // Inicializar la conexión WebSocket
  private initializeWebSocket(mesaId: string) {
    try {
      this.socket = new WebSocket(`${this.wsUrl}/mesa/${mesaId}`);

      this.socket.onopen = () => {
        console.log('WebSocket conexión establecida');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'mesa_update') {
            this.mesaSubject.next(data.mesa); // Actualizar la mesa
          } else if (data.type === 'game_started') {
            // Redirigir a la tabla cuando el juego comience
            this.router.navigate(['/tabla'], {
              state: {
                mesaId: data.mesaId
              }
            });
          } else if (data.type === 'table_updated') {
            // Notificar actualización de la tabla
            this.tableUpdateSubject.next(data);
          }
        } catch (error) {
          console.error('Error al procesar mensaje del WebSocket:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket conexión cerrada');
        this.attemptReconnection(mesaId);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // No cerrar el socket aquí, dejar que onclose maneje la reconexión
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
      this.attemptReconnection(mesaId);
    }
  }

  // Intentar reconexión
  private attemptReconnection(mesaId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const reconnectDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

      console.log(`Intentando reconectar en ${reconnectDelay}ms (intento ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.initializeWebSocket(mesaId);
      }, reconnectDelay);
    } else {
      console.error('Máximo número de intentos de reconexión alcanzado');
      this.mesaSubject.next(null);
    }
  }


  sendStartGame(mesaId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'start_game',
        mesaId: mesaId
      }));
    } else {
      console.warn('WebSocket no está conectado, no se puede enviar el evento de inicio de partida.');
    }
  }

  // Enviar actualización de la tabla
  sendTableUpdate(mesaId: string, rowIndex: number, colIndex: number, value: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'table_update',
        mesaId: mesaId,
        rowIndex: rowIndex,
        colIndex: colIndex,
        value: value
      }));
    } else {
      console.warn('WebSocket no está conectado, no se puede enviar la actualización de la tabla.');
    }
  }

  getTableUpdates(): Observable<any> {
    return this.tableUpdateSubject.asObservable();
  }

  getMesaUpdates(): Observable<Mesa | null> {
    return this.mesaSubject.asObservable();
  }

  joinMesa(mesaId: string, jugador: Jugador) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join_mesa',
        mesaId,
        jugador
      }));
    } else {
      console.warn('WebSocket no está conectado, agregando a cola de eventos pendientes...');
      // Esperar a que el socket esté listo y reintentar
      setTimeout(() => this.joinMesa(mesaId, jugador), 1000);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.mesaSubject.next(null);
  }

}
