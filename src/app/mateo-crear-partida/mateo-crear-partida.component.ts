// mateo-crear-partida.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, Usuario } from '../user.service';
import { GameService, Mesa, Jugador } from '../game.service';

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
  ) {}

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
    if (this.numJugadores >= 2 && this.numJugadores <= 6) {
      this.numeroBarajas = 2;
    } else if (this.numJugadores >= 7 && this.numJugadores <= 11) {
      this.numeroBarajas = 3;
    } else if (this.numJugadores >= 12 && this.numJugadores <= 18) {
      this.numeroBarajas = 4;
    } else {
      this.numJugadores = 2;
      this.numeroBarajas = 2;
    }
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
      const jugadorCreador: Jugador = {
        id: `jugador_${Date.now()}`,
        nombre: this.usuario.name,
        avatar: this.usuario.avatar
      };

      const mesaData = {
        cant_jugadores: this.numJugadores,
        cant_barajas: this.numeroBarajas,
        cod_sala: this.generarCodigoPartida(),
        jugadorCreador
      };

      const mesa = await this.gameService.createMesa(mesaData).toPromise();

      if (mesa) {
        const detallesPartida = {
          numJugadores: this.numJugadores,
          numeroBarajas: this.numeroBarajas,
          mesaId: mesa.id,
          codigoSala: mesa.cod_sala
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
