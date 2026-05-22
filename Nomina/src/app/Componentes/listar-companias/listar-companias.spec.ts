import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCompanias } from './listar-companias';

describe('ListarCompanias', () => {
  let component: ListarCompanias;
  let fixture: ComponentFixture<ListarCompanias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCompanias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCompanias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
