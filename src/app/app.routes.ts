import { Routes } from '@angular/router';
import { Catalogo } from './pages/catalogo/catalogo';
import { RegistroPedido } from './pages/registro-pedido/registro-pedido';
import { Historial } from './pages/historial/historial';
import { DetallePedido } from './pages/detalle-pedido/detalle-pedido';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Catalogo },
  { path: 'registro', component: RegistroPedido },
  { path: 'historial', component: Historial },
  { path: 'pedidos/:id', component: DetallePedido },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' }
];