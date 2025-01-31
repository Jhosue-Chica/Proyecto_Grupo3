import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
  }

  getUsuario() {
    return this.usuarioSubject.value;
  }

  clearUsuario() {
    this.usuarioSubject.next(null);
  }
}
