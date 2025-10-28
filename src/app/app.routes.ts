import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

  // Home general para cualquier rol autenticado
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },

  // Área Admin con tabs
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/tabs/tabs.page').then(m => m.AdminTabsPage),
    children: [
      { path: 'dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'pedidos',   data: { title: 'Pedidos' },   loadComponent: () => import('./pages/admin/pedidos/pedidos.page').then(m => m.PedidosPage) },
      // { path: 'productos', data: { title: 'Productos' }, loadComponent: () => import('./pages/admin/productos/productos.page').then(m => m.ProductosPage) },
      // { path: 'usuarios',  data: { title: 'Usuarios' },  loadComponent: () => import('./pages/admin/usuarios/usuarios.page').then(m => m.UsuariosPage) },
      // { path: 'perfil',    data: { title: 'Perfil' },    loadComponent: () => import('./pages/admin/perfil/perfil.page').then(m => m.PerfilPage) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },

  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
