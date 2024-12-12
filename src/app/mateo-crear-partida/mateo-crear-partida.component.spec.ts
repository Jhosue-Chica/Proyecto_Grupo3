import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateoCrearPartidaComponent } from './mateo-crear-partida.component';

describe('MateoCrearPartidaComponent', () => {
  let component: MateoCrearPartidaComponent;
  let fixture: ComponentFixture<MateoCrearPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateoCrearPartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateoCrearPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
