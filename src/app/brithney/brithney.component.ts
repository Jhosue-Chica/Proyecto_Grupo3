import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brithney',
  standalone: true,
  imports: [FormsModule,CommonModule],
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

  // Función para asignar colores a cada columna
  getColumnClass(index: number): string {
    const colors = ['custom-bg-1', 'custom-bg-2', 'custom-bg-3', 'custom-bg-4'];
    return colors[index % colors.length]; // Asigna un color cíclico
  }

  // Calcula la suma de cada columna
  getSumaColumna(columnaIndex: number): number {
    return this.filas.reduce((suma, fila) => {
      const valor = parseFloat(fila.valores[columnaIndex]) || 0;
      return suma + valor;
    }, 0);
  }

  // Función para manejar el evento input
  onInputChange(event: any, columnIndex: number) {
    // Puedes manejar el valor ingresado aquí si es necesario
    console.log('Valor ingresado:', event.target.value);
  }
}
