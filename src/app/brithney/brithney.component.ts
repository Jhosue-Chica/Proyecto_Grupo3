import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brithney',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './brithney.component.html',
  styleUrl: './brithney.component.css'
})
export class BrithneyComponent {

  columnas = ['Juan', 'María', 'Pedro', 'Ana']; // Nombres de personas
  filas = [
    { nombre: '1/3', valores: ['', '', '', ''] },
    { nombre: '2/3', valores: ['', '', '', ''] },
    { nombre: '1/4', valores: ['', '', '', ''] },
    { nombre: '2/4', valores: ['', '', '', ''] },
    { nombre: '1/5', valores: ['', '', '', ''] },
    { nombre: '2/5', valores: ['', '', '', ''] },
    { nombre: 'Escalera', valores: ['', '', '', ''] },
  ];


  // Calcula la suma de cada columna
  getSumaColumna(columnaIndex: number): number {
    return this.filas.reduce((sum, fila) => {
      const valor = parseFloat(fila.valores[columnaIndex]);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
  }

 // Evita el cambio de campo al presionar Enter
 preventEnter(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}
  // Función para asignar colores a cada columna
  getColumnClass(index: number): string {
    const colors = ['custom-bg-1', 'custom-bg-2', 'custom-bg-3', 'custom-bg-4'];
    return colors[index % colors.length]; // Asigna un color cíclico
  }


}
