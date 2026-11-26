export interface Producto {
  id: number;
  nombre: string;
  categoria: 'Laptops' | 'Periféricos' | 'Monitores';
  precio: number;
  stock: number;
  imagen: string;
}

export interface Pedido {
  id?: number;
  cliente: string;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  total: number;
  fecha: Date;
  estado: 'Completado' | 'Cancelado';
}