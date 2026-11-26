import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TiendaService } from '../../services/tienda';
import { Producto } from '../../models/tienda.model';

@Component({
  selector: 'app-registro-pedido',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './registro-pedido.html',
  styleUrl: './registro-pedido.css'
})
export class RegistroPedido implements OnInit {
  private fb = inject(FormBuilder);
  private tiendaService = inject(TiendaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  mensajeError: string = '';

  pedidoForm: FormGroup = this.fb.group({
    cliente: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],
    productoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  async ngOnInit() {
    this.productos = await this.tiendaService.obtenerProductos();

    const prodIdParam = this.route.snapshot.queryParamMap.get('productoId');
    if (prodIdParam) {
      this.pedidoForm.patchValue({ productoId: prodIdParam });
    }

    this.cdr.detectChanges();
  }

  filtrarSoloLetras(event: Event) {
    const input = event.target as HTMLInputElement;
    const soloLetras = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    if (input.value !== soloLetras) {
      input.value = soloLetras;
      this.pedidoForm.get('cliente')?.setValue(soloLetras);
    }
  }

  get totalCalculado(): number {
    const idSeleccionado = Number(this.pedidoForm.get('productoId')?.value);
    const cantidad = Number(this.pedidoForm.get('cantidad')?.value) || 0;
    const producto = this.productos.find(p => p.id === idSeleccionado);
    return producto ? producto.precio * cantidad : 0;
  }

  async guardarPedido() {
    this.mensajeError = '';

    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    const { cliente, productoId, cantidad } = this.pedidoForm.value;
    const producto = this.productos.find(p => p.id === Number(productoId));

    if (!producto) {
      this.mensajeError = 'El producto seleccionado no es válido.';
      return;
    }

    if (cantidad > producto.stock) {
      this.mensajeError = `Stock insuficiente. Solo quedan ${producto.stock} unidad(es) disponible(s).`;
      return;
    }

    try {
      await this.tiendaService.registrarPedido({
        cliente: cliente.trim(),
        productoId: producto.id,
        productoNombre: producto.nombre,
        cantidad: Number(cantidad),
        total: this.totalCalculado,
        fecha: new Date(),
        estado: 'Completado'
      });

      this.router.navigate(['/historial']);
    } catch (error) {
      this.mensajeError = 'Ocurrió un error al registrar el pedido.';
    }
  }
}