import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { TiendaService } from '../../services/tienda';
import { Pedido } from '../../models/tienda.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe, NgClass, TitleCasePipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
  private tiendaService = inject(TiendaService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  filtroEstado: string = 'Todos';

  async ngOnInit() {
    const lista = await this.tiendaService.obtenerPedidos();
    this.pedidos = lista.reverse();
    this.cdr.detectChanges();
  }

  get pedidosFiltrados(): Pedido[] {
    if (this.filtroEstado === 'Todos') return this.pedidos;
    return this.pedidos.filter(p => p.estado === this.filtroEstado);
  }
}