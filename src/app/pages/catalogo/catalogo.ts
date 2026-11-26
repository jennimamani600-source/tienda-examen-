import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TiendaService } from '../../services/tienda';
import { Producto } from '../../models/tienda.model';
import { ProductoCard } from '../../components/producto-card/producto-card';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private tiendaService = inject(TiendaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  textoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  menuCategoriasAbierto: boolean = false;

  async ngOnInit() {
    this.productos = await this.tiendaService.obtenerProductos();
    this.cdr.detectChanges();
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.menuCategoriasAbierto = false;
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase().trim());
      const coincideCategoria = this.categoriaSeleccionada === '' || p.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }

  irAPedir(producto: Producto) {
    this.router.navigate(['/registro'], { queryParams: { productoId: producto.id } });
  }
}