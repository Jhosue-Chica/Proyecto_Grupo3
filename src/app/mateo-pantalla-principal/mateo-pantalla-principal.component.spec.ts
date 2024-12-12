import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateoPantallaPrincipalComponent } from './mateo-pantalla-principal.component';

describe('MateoPantallaPrincipalComponent', () => {
  let component: MateoPantallaPrincipalComponent;
  let fixture: ComponentFixture<MateoPantallaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateoPantallaPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateoPantallaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
