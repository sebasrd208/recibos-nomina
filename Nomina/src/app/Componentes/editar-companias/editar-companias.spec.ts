import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCompanias } from './editar-companias';

describe('EditarCompanias', () => {
  let component: EditarCompanias;
  let fixture: ComponentFixture<EditarCompanias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCompanias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCompanias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
