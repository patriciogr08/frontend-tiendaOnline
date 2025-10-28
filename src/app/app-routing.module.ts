import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  // {
  //   path: 'register',
  //   loadChildren: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  // },
  // {
  //   path: 'productos',
  //   loadChildren: () => import('./pages/productos/productos.page').then( m => m.ProductosPage)
  // },
  // {
  //   path: 'carrito',
  //   loadChildren: () => import('./pages/carrito/carrito.page').then( m => m.CarritoPage)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
