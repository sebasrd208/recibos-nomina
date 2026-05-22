import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDocumentos } from './editar-documentos';

describe('EditarDocumentos', () => {
  let component: EditarDocumentos;
  let fixture: ComponentFixture<EditarDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDocumentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
