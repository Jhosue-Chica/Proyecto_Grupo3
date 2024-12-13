import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhosueGanadoresComponent } from './jhosue-ganadores.component';

describe('JhosueGanadoresComponent', () => {
  let component: JhosueGanadoresComponent;
  let fixture: ComponentFixture<JhosueGanadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhosueGanadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JhosueGanadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
