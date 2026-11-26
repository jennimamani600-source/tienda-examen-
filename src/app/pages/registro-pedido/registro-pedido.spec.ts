import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPedido } from './registro-pedido';

describe('RegistroPedido', () => {
  let component: RegistroPedido;
  let fixture: ComponentFixture<RegistroPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPedido],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
