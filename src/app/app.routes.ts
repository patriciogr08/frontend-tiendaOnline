import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { allowRolesGuard } from './core/guards/allow-roles.guard';

export const routes: Routes = [
  // Login
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

  // Home (genérico para cualquier autenticado)
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },

  // ===================== ÁREA ADMIN =====================
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // ya tienes este guard específico
    loadComponent: () => import('./pages/admin/tabs/tabs.page').then(m => m.AdminTabsPage),
    children: [
      { path: 'dashboard', data: { title: 'Dashboard' },  loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'pedidos',   data: { title: 'Pedidos' },    loadComponent: () => import('./pages/admin/pedidos/pedidos.page').then(m => m.PedidosPage) },
      { path: 'productos', data: { title: 'Productos' },  loadComponent: () => import('./pages/admin/productos/productos.page').then(m => m.ProductosPage) },
      // { path: 'usuarios',  data: { title: 'Usuarios' },   loadComponent: () => import('./pages/admin/usuarios/usuarios.page').then(m => m.UsuariosPage) },
      // { path: 'perfil',    data: { title: 'Perfil' },     loadComponent: () => import('./pages/admin/perfil/perfil.page').then(m => m.PerfilPage) },
      // { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },

  // // ===================== CLIENTE =====================
  // // Catálogo (productos visibles al cliente). También puede entrar ADMIN si lo deseas.
  // {
  //   path: 'shop',
  //   canActivate: [authGuard, allowRolesGuard],
  //   data: { roles: ['CLIENTE', 'ADMIN'] },
  //   loadComponent: () => import('./pages/shop/shop.page').then(m => m.ShopPage)
  // },

  // // Pedidos del cliente (estado de sus pedidos)
  // {
  //   path: 'orders',
  //   canActivate: [authGuard, allowRolesGuard],
  //   data: { roles: ['CLIENTE'] },
  //   loadComponent: () => import('./pages/orders/orders.page').then(m => m.OrdersPage)
  // },

  // // ===================== REPARTIDOR =====================
  // // Pedidos asignados al repartidor
  // {
  //   path: 'courier/orders',
  //   canActivate: [authGuard, allowRolesGuard],
  //   data: { roles: ['REPARTIDOR'] },
  //   loadComponent: () => import('./pages/courier/orders/courier-orders.page').then(m => m.CourierOrdersPage)
  // },

  // ===================== DEFAULT =====================
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
