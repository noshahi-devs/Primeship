import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent {
  // Seller Stats
  sellerStats = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+18.2%',
      trend: 'up',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'My Products',
      value: '23',
      change: '+2',
      trend: 'up',
      icon: '📦',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      icon: '🛒',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: '⭐',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  // Recent Orders
  recentOrders = [
    {
      id: '#S12345',
      customer: 'Alice Johnson',
      product: 'iPhone 15 Pro Case',
      amount: '$29.99',
      status: 'completed',
      date: '2024-01-20',
      rating: 5
    },
    {
      id: '#S12346',
      customer: 'Bob Smith',
      product: 'MacBook Air Sleeve',
      amount: '$39.99',
      status: 'processing',
      date: '2024-01-20',
      rating: null
    },
    {
      id: '#S12347',
      customer: 'Carol Davis',
      product: 'AirPods Pro Accessories',
      amount: '$19.99',
      status: 'pending',
      date: '2024-01-19',
      rating: null
    }
  ];

  // My Products
  myProducts = [
    {
      name: 'iPhone 15 Pro Case',
      sales: 45,
      revenue: '$1,349.55',
      rating: 4.8,
      stock: 120,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      name: 'MacBook Air Sleeve',
      sales: 23,
      revenue: '$919.77',
      rating: 4.9,
      stock: 45,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      name: 'AirPods Pro Accessories',
      sales: 67,
      revenue: '$1,339.33',
      rating: 4.7,
      stock: 89,
      image: 'https://via.placeholder.com/60x60'
    }
  ];

  // Earnings Chart Data
  earningsData = [
    { month: 'Jan', earnings: 3200 },
    { month: 'Feb', earnings: 3800 },
    { month: 'Mar', earnings: 3500 },
    { month: 'Apr', earnings: 4200 },
    { month: 'May', earnings: 4100 },
    { month: 'Jun', earnings: 4800 }
  ];

  // Quick Actions
  quickActions = [
    { title: 'Add New Product', icon: '➕', route: '/seller/products/add' },
    { title: 'View Orders', icon: '📋', route: '/seller/orders' },
    { title: 'Earnings Report', icon: '💰', route: '/seller/earnings' },
    { title: 'Edit Profile', icon: '👤', route: '/seller/profile' }
  ];

  constructor() { }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      completed: 'success',
      processing: 'warning',
      pending: 'info',
      cancelled: 'danger'
    };
    return colors[status] || 'info';
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };
    return icons[trend] || '➡️';
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '⭐'.repeat(fullStars) + 
           (halfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
  }

  onQuickAction(action: any) {
    console.log('Quick action clicked:', action);
  }

  viewOrderDetails(orderId: string) {
    console.log('View order details:', orderId);
  }

  viewProductDetails(productName: string) {
    console.log('View product details:', productName);
  }
}
