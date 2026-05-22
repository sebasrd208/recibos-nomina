import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guardar } from './guardar';

describe('Guardar', () => {
  let component: Guardar;
  let fixture: ComponentFixture<Guardar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guardar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Guardar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
