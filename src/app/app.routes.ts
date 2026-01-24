import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { SellerDashboardComponent } from './pages/seller/dashboard/seller-dashboard.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { ThreeplPartnersComponent } from './pages/admin/threepl-partners/threepl-partners.component';
import { InventoryComponent } from './pages/admin/inventory/inventory.component';
import { CustomersComponent } from './pages/admin/customers/customers.component';
import { SellersComponent } from './pages/admin/sellers/sellers.component';
import { FinanceComponent } from './pages/admin/finance/finance.component';
import { HomeComponent } from './public/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    component: HomeComponent
  },
 {
        path: 'home',
        component: HomeComponent
      },
  {
    path: 'home',
    loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./public/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./public/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./public/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./public/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./public/auth/auth.routes').then(m => m.authRoutes)
  // },
  // {
  //   path: 'account',
  //   loadChildren: () => import('./public/account/account.routes').then(m => m.accountRoutes)
  // },
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
        component: InventoryComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'threepl-partners',
        component: ThreeplPartnersComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'sellers',
        component: SellersComponent
      },
      {
        path: 'finance',
        component: FinanceComponent
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
    redirectTo: '/home'
  }
];
