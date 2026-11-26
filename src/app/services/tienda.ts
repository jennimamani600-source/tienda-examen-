import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Producto, Pedido } from '../models/tienda.model';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    const db = await openDB('JenniStoreDB_v5', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('productos')) {
          db.createObjectStore('productos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pedidos')) {
          db.createObjectStore('pedidos', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    const count = await db.count('productos');
    if (count === 0) {
      const productosIniciales: Producto[] = [
        {
          id: 1,
          nombre: 'Laptop ThinkPad X1',
          categoria: 'Laptops',
          precio: 8500,
          stock: 6,
          imagen: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8ODQ4NDd8aW1hZ2UvcG5nfGgyMi9oOGYvMTA2NzQ1ODc3Mjk5NTAucG5nfDQzODYxOTc5ODA0MWJhZTQyYThjOTAzZjE0NDI2NWVjYjY5MjE3MGFiMWEzODhlN2UyMGUwNGZhMWRmOTJmNzg/lenovo-laptop-thinkpad-x1-carbon-gen8-subseries-hero.png'
        },
        {
          id: 2,
          nombre: 'Teclado Mecánico RGB',
          categoria: 'Periféricos',
          precio: 450,
          stock: 12,
          imagen: 'https://mla-s1-p.mlstatic.com/687094-MLU77797617578_072024-F.jpg'
        },
        {
          id: 3,
          nombre: 'Monitor Dell 24"',
          categoria: 'Monitores',
          precio: 1600,
          stock: 4,
          imagen: 'https://m.media-amazon.com/images/I/71L4-9ZCfoL.jpg'
        },
        {
          id: 4,
          nombre: 'Mouse Inalámbrico Pro',
          categoria: 'Periféricos',
          precio: 280,
          stock: 15,
          imagen: 'https://tse2.mm.bing.net/th/id/OIP.0HXQLlrRonX4kCgipqi79gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
          id: 5,
          nombre: 'MacBook Air M2',
          categoria: 'Laptops',
          precio: 9800,
          stock: 3,
          imagen: 'https://tse3.mm.bing.net/th/id/OIP.PSm2-rZ4ghYETOUY7fewwQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
          id: 6,
          nombre: 'Monitor Curvo Gamer 27"',
          categoria: 'Monitores',
          precio: 2450,
          stock: 5,
          imagen: 'https://tse4.mm.bing.net/th/id/OIP.SKE03oFFs4fbXuYhYrcFygHaH2?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        }
      ];

      for (const prod of productosIniciales) {
        await db.put('productos', prod);
      }
    }

    return db;
  }

  async obtenerProductos(): Promise<Producto[]> {
    const db = await this.dbPromise;
    return db.getAll('productos');
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    const db = await this.dbPromise;
    return db.getAll('pedidos');
  }

  async obtenerPedidoPorId(id: number): Promise<Pedido | undefined> {
    const db = await this.dbPromise;
    return db.get('pedidos', id);
  }

  async registrarPedido(pedido: Pedido): Promise<void> {
    const db = await this.dbPromise;
    const producto = await db.get('productos', pedido.productoId);

    if (!producto || producto.stock < pedido.cantidad) {
      throw new Error('Stock insuficiente para realizar el pedido.');
    }

    producto.stock -= pedido.cantidad;
    await db.put('productos', producto);
    await db.add('pedidos', pedido);
  }

  async cancelarPedido(pedidoId: number): Promise<void> {
    const db = await this.dbPromise;
    const pedido: Pedido | undefined = await db.get('pedidos', pedidoId);

    if (!pedido || pedido.estado === 'Cancelado') return;

    pedido.estado = 'Cancelado';
    await db.put('pedidos', pedido);

    const producto: Producto | undefined = await db.get('productos', pedido.productoId);
    if (producto) {
      producto.stock += pedido.cantidad;
      await db.put('productos', producto);
    }
  }

  async actualizarStockProducto(productoId: number, nuevoStock: number): Promise<void> {
    const db = await this.dbPromise;
    const producto: Producto | undefined = await db.get('productos', productoId);
    if (!producto) return;

    producto.stock = Math.max(0, nuevoStock);
    await db.put('productos', producto);
  }

  async agregarProducto(nuevo: Omit<Producto, 'id'>): Promise<void> {
    const db = await this.dbPromise;
    const todos = await db.getAll('productos');
    const maxId = todos.reduce((max, p) => (p.id > max ? p.id : max), 0);
    await db.put('productos', { ...nuevo, id: maxId + 1 });
  }
}