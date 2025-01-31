import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JhosueCrearUsuarioComponent } from '../jhosue-crear-usuario/jhosue-crear-usuario.component';
import { UserService, Usuario } from '../user.service';

@Component({
  selector: 'app-mateo-pantalla-principal',
  standalone: true,
  imports: [RouterModule, CommonModule, JhosueCrearUsuarioComponent],
  templateUrl: './mateo-pantalla-principal.component.html',
  styleUrl: './mateo-pantalla-principal.component.css'
})
export class MateoPantallaPrincipalComponent implements OnInit {
  usuario: Usuario | null = null;
  showModal = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del usuario
    this.userService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    // Mostrar modal si no hay usuario
    if (!this.userService.getUsuario()) {
      this.showModal = true;
    }
  }

  crearPartida() {
    if (this.usuario) {
      this.router.navigate(['/crear-partida']);
    }
  }

  unirsePartida() {
    if (this.usuario) {
      this.router.navigate(['/unirse-partida']);
    }
  }

  handleUserCreated(user: Usuario) {
    this.userService.setUsuario(user);
    this.showModal = false;
  }
}
