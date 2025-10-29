import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { allowRolesGuard } from './core/guards/allow-roles.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

  // ===== ADMIN (con tabs propios) =====
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/tabs/tabs.page').then(m => m.AdminTabsPage),
    children: [
      { path: 'dashboard',  data:{title:'Dashboard'},  loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'pedidos',    data:{title:'Pedidos'},    loadComponent: () => import('./pages/admin/pedidos/pedidos.page').then(m => m.PedidosPage) },
      { path: 'productos',  data:{title:'Productos'},  loadComponent: () => import('./pages/admin/productos/productos.page').then(m => m.ProductosPage) },
      // { path: 'usuarios',   data:{title:'Usuarios'},   loadComponent: () => import('./pages/admin/usuarios/usuarios.page').then(m => m.UsuariosPage) },
      { path: 'perfil',     data:{title:'Perfil'},     loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },

  // ===== CLIENTE (tabs propios) =====
  {
    path: 'client',
    canActivate: [authGuard, allowRolesGuard],
    data: { roles: ['CLIENTE','ADMIN'] }, // permite que ADMIN lo revise si quieres
    loadComponent: () => import('./pages/client/tabs/client-tabs.page').then(m => m.ClientTabsPage),
    children: [
      { path: 'shop',    data:{title:'Catálogo'},    loadComponent: () => import('./pages/client/shop/shop.page').then(m => m.ShopPage) },
      { path: 'cart',    data:{title:'Carrito'},     loadComponent: () => import('./pages/client/cart/cart.page').then(m => m.CartPage) },
      { path: 'orders',  data:{title:'Mis pedidos'}, loadComponent: () => import('./pages/client/orders/orders.page').then(m => m.OrdersPage) },
      { path: 'profile', data:{title:'Perfil'},      loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
      { path: '', pathMatch: 'full', redirectTo: 'shop' }
    ]
  },

  // ===== REPARTIDOR (tabs propios, opcional) =====
  {
    path: 'courier',
    canActivate: [authGuard, allowRolesGuard],
    data: { roles: ['CLIENTE','ADMIN'] },
    loadComponent: () => import('./pages/courier/tabs/courier-tabs.page').then(m => m.CourierTabsPage),
    children: [
      { path: 'orders',  data:{title:'Asignados'}, loadComponent: () => import('./pages/courier/orders/courier-orders.page').then(m => m.CourierOrdersPage) },
      { path: 'profile', data:{title:'Perfil'},    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
      { path: '', pathMatch: 'full', redirectTo: 'orders' }
    ]
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
