// cesar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, Usuario } from '../user.service';
import { GameService } from '../game.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-cesar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cesar.component.html',
  styleUrl: './cesar.component.css'
})
export class CesarComponent implements OnInit {
  form: FormGroup;
  usuario: Usuario | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private gameService: GameService,
    private websocketService: WebsocketService,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]]
    });
  }

  private generarJugadorId(nombre: string): string {
    const timestamp = Date.now();
    const nombreLimpio = nombre.toLowerCase().replace(/\s+/g, '_');
    const randomStr = Math.random().toString(36).substring(2, 5);
    return `jugador_${nombreLimpio}_${timestamp}_${randomStr}`;
  }

  get codigo() {
    return this.form.get('codigo');
  }

  ngOnInit() {
    this.userService.usuario$.subscribe(usuario => {
      if (!usuario) {
        this.router.navigate(['/']);
        return;
      }
      this.usuario = usuario;
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && this.usuario) {
      this.isLoading = true;
      this.errorMessage = '';
      const codigo = this.form.value.codigo;

      try {
        const mesas = await this.gameService.getMesas().toPromise();
        const mesa = mesas?.find(m => m.cod_sala === codigo);

        if (!mesa) {
          this.errorMessage = 'Código de sala no válido';
          return;
        }

        if (Object.keys(mesa.jugadores).length >= mesa.cant_jugadores) {
          this.errorMessage = 'La sala está llena';
          return;
        }

        const jugadorExistente = Object.values(mesa.jugadores)
          .find(j => j.nombre === this.usuario?.name);

        if (jugadorExistente) {
          this.errorMessage = 'Ya estás en esta sala';
          return;
        }

        const jugador = {
          id: this.generarJugadorId(this.usuario.name),
          nombre: this.usuario.name,
          avatar: this.usuario.avatar
        };

        const mesaActualizada = await this.gameService.updateMesa(mesa.id!, {
          jugadores: {
            ...mesa.jugadores,
            [jugador.id]: jugador
          }
        }).toPromise();

        if (mesaActualizada) {
          this.gameService.setMesaActual(mesaActualizada);

          this.websocketService.connectToMesa(mesa.id!);
          this.websocketService.joinMesa(mesa.id!, jugador);

          // Navegar al lobby con el flag esCreador en false
          this.router.navigate(['/lobby'], {
            state: {
              detallesPartida: {
                mesaId: mesa.id,
                numJugadores: mesa.cant_jugadores,
                numeroBarajas: mesa.cant_barajas,
                codigoSala: mesa.cod_sala,
                esCreador: false  // Añadido el flag de creador en false
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al unirse a la sala:', error);
        this.errorMessage = 'Error al unirse a la sala. Por favor, intenta nuevamente.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
