import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { SellerDashboardComponent } from './pages/seller/dashboard/seller-dashboard.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'inventory',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'orders',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'customers',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'sellers',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'finance',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'reports',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'users',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'settings',
        component: DashboardComponent // Placeholder
      }
    ]
  },
  {
    path: 'seller',
    children: [
      {
        path: 'dashboard',
        component: SellerDashboardComponent
      },
      {
        path: 'products',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'orders',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'earnings',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'profile',
        component: DashboardComponent // Placeholder
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/admin/dashboard'
  }
];
