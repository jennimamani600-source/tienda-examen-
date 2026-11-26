import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { TiendaService } from '../../services/tienda';
import { Pedido } from '../../models/tienda.model';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, NgClass, TitleCasePipe],
  templateUrl: './detalle-pedido.html',
  styleUrl: './detalle-pedido.css'
})
export class DetallePedido implements OnInit {
  private route = inject(ActivatedRoute);
  private tiendaService = inject(TiendaService);
  private cdr = inject(ChangeDetectorRef);

  pedido?: Pedido;
  cargando: boolean = true;
  mensajeExito: string = '';

  async ngOnInit() {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(idParam)) {
      this.pedido = await this.tiendaService.obtenerPedidoPorId(idParam);
    }
    this.cargando = false;
    this.cdr.detectChanges();
  }

  async cancelar() {
    if (!this.pedido?.id || this.pedido.estado === 'Cancelado') return;

    await this.tiendaService.cancelarPedido(this.pedido.id);
    this.pedido.estado = 'Cancelado';
    this.mensajeExito = 'El pedido fue cancelado y las unidades regresaron al inventario.';
    this.cdr.detectChanges();
  }
}