import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarUsuarios } from './guardar-usuarios';

describe('GuardarUsuarios', () => {
  let component: GuardarUsuarios;
  let fixture: ComponentFixture<GuardarUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardarUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
