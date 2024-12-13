import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-cesar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cesar.component.html',
  styleUrl: './cesar.component.css'
})
export class CesarComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      codigo: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)])
    });    
  }

  get codigo() {
    return this.form.get('codigo');
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Código válido', this.form.value.codigo);
    } else {
      console.log('Formulario inválido');
    }
  }
}
