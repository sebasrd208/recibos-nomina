import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Guardar } from './guardar';
import { Servidor } from '../../Servidor/servidor';

describe('Guardar', () => {
  let component: Guardar;
  let fixture: ComponentFixture<Guardar>;
  let servidorSpy: jasmine.SpyObj<Servidor>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    servidorSpy = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['guardar']
    );

    routerSpy = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    await TestBed.configureTestingModule({
      imports: [Guardar],
      providers: [
        { provide: Servidor, useValue: servidorSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Guardar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });
});