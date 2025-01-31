// mateo-crear-partida.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, Usuario } from '../user.service';
import { GameService, Mesa, Jugador, Partida } from '../game.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mateo-crear-partida',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mateo-crear-partida.component.html',
  styleUrl: './mateo-crear-partida.component.css'
})
export class MateoCrearPartidaComponent implements OnInit {
  usuario: Usuario | null = null;
  numJugadores: number = 2;
  numeroBarajas: number = 2;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.usuario$.subscribe(usuario => {
      if (!usuario) {
        this.router.navigate(['/']);
        return;
      }
      this.usuario = usuario;
    });
  }

  calcularNumeroBarajas(): void {
    if (this.numJugadores < 2) {
      this.numJugadores = 2;
    } else if (this.numJugadores > 6) {
      this.numJugadores = 6;
    }
    this.numeroBarajas = 2;
  }

  generarCodigoPartida(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitud = 6;
    return Array.from(
      { length: longitud },
      () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
  }

  async crearPartida(): Promise<void> {
    if (!this.usuario) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const generarJugadorId = (): string => {
        return `jugador_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      };

      const jugadorCreador: Jugador = {
        id: generarJugadorId(),
        nombre: this.usuario.name,
        avatar: this.usuario.avatar
      };

      // Crear la mesa con el creador_id
      const mesaData = {
        cant_jugadores: this.numJugadores,
        cant_barajas: this.numeroBarajas,
        cod_sala: this.generarCodigoPartida(),
        creador_id: jugadorCreador.id, // Añadido el ID del creador
        jugadorCreador
      };

      const mesa = await firstValueFrom(this.gameService.createMesa(mesaData));

      if (mesa && mesa.id) {
        const partidaData = {
          id_mesa: mesa.id,
          jugadores: [
            {
              id: jugadorCreador.id,
              nombre: jugadorCreador.nombre
            }
          ]
        };

        const partida = await firstValueFrom(this.gameService.createPartida(partidaData));

        const detallesPartida = {
          numJugadores: this.numJugadores,
          numeroBarajas: this.numeroBarajas,
          mesaId: mesa.id,
          partidaId: partida.id,
          codigoSala: mesa.cod_sala,
          esCreador: true // Añadido el flag de creador
        };

        this.router.navigate(['/lobby'], {
          state: { detallesPartida }
        });
      }
    } catch (error) {
      console.error('Error al crear la partida:', error);
      this.errorMessage = 'Error al crear la partida. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
}
