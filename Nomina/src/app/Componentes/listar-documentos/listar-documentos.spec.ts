import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDocumentos } from './listar-documentos';

describe('ListarDocumentos', () => {
  let component: ListarDocumentos;
  let fixture: ComponentFixture<ListarDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDocumentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
