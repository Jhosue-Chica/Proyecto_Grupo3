import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jhosue-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jhosue-crear-usuario.component.html',
  styleUrls: ['./jhosue-crear-usuario.component.css']
})
export class JhosueCrearUsuarioComponent {
  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<any>();

  userName: string = '';
  selectedAvatar: number | null = null;
  avatares = [1, 2, 3, 4, 5, 6]; // Números de avatares disponibles

  get isValid(): boolean {
    return this.userName.trim().length > 0 && this.selectedAvatar !== null;
  }

  selectAvatar(avatar: number) {
    this.selectedAvatar = avatar;
  }

  closeModal() {
    this.close.emit();
  }

  guardarUsuario() {
    if (this.isValid) {
      this.userCreated.emit({
        name: this.userName,
        avatar: `/jhosue/avatares${this.selectedAvatar}.png`
      });
      this.closeModal();
    }
  }
}
