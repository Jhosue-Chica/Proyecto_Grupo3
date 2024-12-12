import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrithneyComponent } from './brithney.component';

describe('BrithneyComponent', () => {
  let component: BrithneyComponent;
  let fixture: ComponentFixture<BrithneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrithneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrithneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
