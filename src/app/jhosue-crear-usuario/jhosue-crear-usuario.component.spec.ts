import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhosueCrearUsuarioComponent } from './jhosue-crear-usuario.component';

describe('JhosueCrearUsuarioComponent', () => {
  let component: JhosueCrearUsuarioComponent;
  let fixture: ComponentFixture<JhosueCrearUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhosueCrearUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JhosueCrearUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
