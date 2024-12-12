import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhosueComponent } from './jhosue.component';

describe('JhosueComponent', () => {
  let component: JhosueComponent;
  let fixture: ComponentFixture<JhosueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhosueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JhosueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
