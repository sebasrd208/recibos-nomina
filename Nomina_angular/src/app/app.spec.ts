import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { App } from './app';
import { Navbar } from './Componentes/navbar/navbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: ''
})
class NavbarMock {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    })
      .overrideComponent(App, {
        remove: {
          imports: [Navbar]
        },
        add: {
          imports: [NavbarMock]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear la aplicación', () => {
    expect(component).toBeTruthy();
  });

  it('Debería renderizar la aplicación', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});