import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  jugadores: {
    [key: string]: Jugador; // Jugadores como un mapa (objeto)
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
  valores: string[];
  puntuacion: number;
}

export interface JugadorPartida {
  nombre: string;
  puntuacion_total: number;
  rondas: {
    [key: string]: Ronda;
  };
}

export interface Partida {
  id?: string;
  id_mesa: string;
  fecha_creacion?: any;
  estado: string;
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

  createPartida(partida: Partial<Partida>): Observable<any> {
    return this.http.post(`${this.apiUrl}/partidas`, partida);
  }

  updatePartidaRonda(
    partidaId: string,
    data: {
      jugador_id: string;
      ronda: string;
      valores: string[];
      puntuacion: number;
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
