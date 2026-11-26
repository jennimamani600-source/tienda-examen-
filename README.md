# Jenni Store — Sistema de Gestión de Pedidos e Inventario

Aplicación web desarrollada en **Angular** con **Bootstrap 5** e **IndexedDB (`idb`)** para la consulta de catálogo tecnológico, registro de pedidos con control de stock, historial filtrado, gestión de detalle/cancelación y panel administrativo.

## Funcionalidades Principales
- **Catálogo de Productos (`/`):** Consulta en tarjetas responsivas con búsqueda por texto y filtro por categoría combinados.
- **Registro de Pedido (`/registro`):** Formulario reactivo con validaciones de campos obligatorios, validación de solo letras en el nombre del cliente, cálculo automático de total y control de stock disponible.
- **Historial de Pedidos (`/historial`):** Listado con formato de fecha, moneda y estado, filtro por estado (`Completado` / `Cancelado`) y acceso al detalle.
- **Detalle y Cancelación (`/pedidos/:id`):** Consulta persistente por identificador (soporta recarga de página con `F5`), manejo de ID inexistente y cancelación con devolución automática de existencias al inventario.
- **Panel Administrativo (`/admin`):** Gestión de inventario y alta de nuevos productos (PIN de acceso: `1234`).

## Requisitos Previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

## Instalación y Ejecución
1. Clonar el repositorio:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
   cd tienda-examen