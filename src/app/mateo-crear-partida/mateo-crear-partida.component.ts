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
  numJugadores: number | null = null;
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

  /**
   * Validación numero jugadores
   */
  validarEntrada(event: KeyboardEvent): void {
    const charCode = event.key;
    const valorActual = this.numJugadores?.toString() || '';
  
    // Evitar que se escriba más de un dígito
    if (valorActual.length >= 1) {
      event.preventDefault();
      return;
    }
  
    // Permitir solo números entre 2 y 6
    if (!['2', '3', '4', '5', '6'].includes(charCode)) {
      event.preventDefault();
    }
  }
  
  validarRango(): void {
    if (this.numJugadores !== null && (this.numJugadores < 2 || this.numJugadores > 6)) {
      this.numJugadores = null;
    }
  }

  calcularNumeroBarajas(): void {
    if (this.numJugadores !== null && this.numJugadores >= 2 && this.numJugadores <= 6) {
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

      const jugadores = this.numJugadores ?? 2; // Usa 2 si es null

      const mesaData = {
        cant_jugadores: jugadores,
        cant_barajas: this.numeroBarajas,
        cod_sala: this.generarCodigoPartida(),
        jugadorCreador
      };

      const mesa = await this.gameService.createMesa(mesaData).toPromise();

      if (mesa) {
        const detallesPartida = {
          numJugadores: jugadores,
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