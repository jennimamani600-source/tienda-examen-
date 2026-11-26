import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TiendaService } from '../../services/tienda';
import { Producto } from '../../models/tienda.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CurrencyPipe, NgClass],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private tiendaService = inject(TiendaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  autenticado: boolean = false;
  claveIngresada: string = '';
  errorClave: boolean = false;
  productos: Producto[] = [];

  nuevoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Laptops', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [5, [Validators.required, Validators.min(0)]],
    imagen: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', Validators.required]
  });

  async ngOnInit() {
    if (sessionStorage.getItem('admin_ok') === 'true') {
      this.autenticado = true;
      await this.cargarInventario();
    }
  }

  async iniciarSesionAdmin() {
    if (this.claveIngresada === '1234') {
      this.autenticado = true;
      this.errorClave = false;
      sessionStorage.setItem('admin_ok', 'true');
      await this.cargarInventario();
    } else {
      this.errorClave = true;
    }
  }

  cerrarSesionAdmin() {
    this.autenticado = false;
    this.claveIngresada = '';
    sessionStorage.removeItem('admin_ok');
    this.router.navigate(['/']);
  }

  async cargarInventario() {
    this.productos = await this.tiendaService.obtenerProductos();
    this.cdr.detectChanges();
  }

  get totalAgotados(): number {
    return this.productos.filter(p => p.stock === 0).length;
  }

  get totalUnidades(): number {
    return this.productos.reduce((acc, p) => acc + p.stock, 0);
  }

  async cambiarStock(prod: Producto, delta: number) {
    await this.tiendaService.actualizarStockProducto(prod.id, prod.stock + delta);
    await this.cargarInventario();
  }

  async marcarAgotado(prod: Producto) {
    await this.tiendaService.actualizarStockProducto(prod.id, 0);
    await this.cargarInventario();
  }

  async crearProducto() {
    if (this.nuevoForm.invalid) {
      this.nuevoForm.markAllAsTouched();
      return;
    }
    await this.tiendaService.agregarProducto(this.nuevoForm.value);
    this.nuevoForm.reset({
      nombre: '',
      categoria: 'Laptops',
      precio: 0,
      stock: 5,
      imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'
    });
    await this.cargarInventario();
  }
}