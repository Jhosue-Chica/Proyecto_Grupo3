import { Component } from '@angular/core';

@Component({
  selector: 'app-jhosue',
  standalone: true,
  imports: [],
  templateUrl: './jhosue.component.html',
  styleUrl: './jhosue.component.css'
})
export class JhosueComponent {

  // Room code properties
  roomCode: string = '';
  copyMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    // Generate room code on component initialization
    this.generateRoomCode();
  }

  // Generate a random room code
  generateRoomCode(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    this.roomCode = Array.from(
      { length: codeLength },
      () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }

  // Copy room code to clipboard
  copyRoomCode(): void {
    // Use the Clipboard API
    navigator.clipboard.writeText(this.roomCode).then(() => {
      this.copyMessage = '¡Código copiado!';

      // Reset the message after 2 seconds
      setTimeout(() => {
        this.copyMessage = '';
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar el código', err);
      this.copyMessage = 'Error al copiar';
    });
  }
}
