import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AutoLoginGuard } from './shared/guards/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    canLoad: [AutoLoginGuard],
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    canActivate: [AuthGuard],
    path: '',
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'detail',
        loadChildren: () => import('./core/detail/detail.module').then(m => m.DetailPageModule)
      },
      {
        path: 'update',
        loadChildren: () => import('./core/update/update.module').then(m => m.UpdatePageModule)
      },
    ],
  },
  {
    path: 'add',
    loadChildren: () => import('./core/add/add.module').then( m => m.AddPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
