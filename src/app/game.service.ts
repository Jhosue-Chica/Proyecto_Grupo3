import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Interfaces
export interface Mesa {
  id?: string;
  cant_jugadores: number;
  cant_barajas: number;
  cod_sala: string;
  estado?: 'en_espera' | 'en_curso' | 'finalizada';
  fecha_creacion?: any;
  ultima_actualizacion?: any;
  creador_id: string; // Add this field to track the creator
  jugadores: {
    [key: string]: Jugador;
  };
}
export interface Jugador {
  id: string;
  nombre: string;
  avatar?: string;
}

interface CreateMesaRequest {
  cant_jugadores: number;
  cant_barajas: number;
  cod_sala: string;
  jugadorCreador: Jugador;
}

export interface Ronda {
  valor: string;
  completada: boolean;
}

export interface JugadorPartida {
  nombre: string;
  posicion: number;
  puntuacion_total: number | null;
  rondas_completadas: number;
  rondas: {
    [key: string]: Ronda;
  };
}

export interface Partida {
  id?: string;
  id_mesa: any;
  fecha_creacion?: any;
  estado: 'en_curso' | 'finalizada';
  num_jugadores: number;
  ronda_actual: string;
  jugadores: {
    [key: string]: JugadorPartida;
  };
}

export interface Victoria {
  mesa_ref: string;
  jugador: {
    id: string;
    nombre: string;
  };
  puntuacion: number;
  fecha?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Añadimos BehaviorSubjects para mantener el estado
  private mesaActualSource = new BehaviorSubject<Mesa | null>(null);
  private partidaActualSource = new BehaviorSubject<Partida | null>(null);

  // Observables públicos
  mesaActual$ = this.mesaActualSource.asObservable();
  partidaActual$ = this.partidaActualSource.asObservable();


  // Método para establecer la mesa actual
  setMesaActual(mesa: Mesa) {
    this.mesaActualSource.next(mesa);
  }

  // Método para establecer la partida actual
  setPartidaActual(partida: Partida) {
    this.partidaActualSource.next(partida);
  }

  // Método para obtener el valor actual de la mesa
  getMesaActual(): Mesa | null {
    return this.mesaActualSource.getValue();
  }

  // Método para obtener el valor actual de la partida
  getPartidaActual(): Partida | null {
    return this.partidaActualSource.getValue();
  }
  // Servicios para Mesas
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/mesas`);
  }

  getMesaById(mesaId: string): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/mesas/${mesaId}`);
  }

  createMesa(mesaData: CreateMesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.apiUrl}/mesas`, mesaData);
  }

  updateMesa(mesaId: string, data: Partial<Mesa>): Observable<any> {
    return this.http.put(`${this.apiUrl}/mesas/${mesaId}`, data);
  }

  updateMesaEstado(mesaId: string, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mesas/${mesaId}/estado`, { estado });
  }

  // Servicios para Partidas
  getPartidas(): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.apiUrl}/partidas`);
  }

  getPartidaById(partidaId: string): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrl}/partidas/${partidaId}`);
  }

  createPartida(partida: {
    id_mesa: string,
    jugadores: { id: string, nombre: string }[]
  }): Observable<Partida> {
    return this.http.post<Partida>(`${this.apiUrl}/partidas`, partida);
  }

  updatePartidaRonda(
    partidaId: string,
    data: {
      jugador_id: string;
      ronda: string;
      valor: string;
    }
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/partidas/${partidaId}/ronda`, data);
  }

  // Servicios para Victorias
  getVictorias(): Observable<Victoria[]> {
    return this.http.get<Victoria[]>(`${this.apiUrl}/wins`);
  }

  createVictoria(victoria: Victoria): Observable<Victoria> {
    return this.http.post<Victoria>(`${this.apiUrl}/wins`, victoria);
  }
}
