import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  orderNo: string;
  customerName: string;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  searchTerm = '';
  selectedStatus: OrderStatus | 'all' = 'all';

  viewModalVisible = false;
  selectedOrder: Order | null = null;

  ngOnInit(): void {
    this.loadDummy();
    this.applyFilters();
  }

  loadDummy(): void {
    this.orders = [
      {
        id: 1,
        orderNo: 'ORD-1001',
        customerName: 'Ali Khan',
        phone: '0300-1111111',
        address: 'Lahore, Punjab',
        status: 'pending',
        createdAt: new Date('2026-01-10'),
        items: [
          { name: 'iPhone 15 Pro', qty: 1, price: 899 },
          { name: 'AirPods Pro', qty: 1, price: 199 }
        ]
      },
      {
        id: 2,
        orderNo: 'ORD-1002',
        customerName: 'Fatima Noor',
        phone: '0301-2222222',
        address: 'Karachi, Sindh',
        status: 'processing',
        createdAt: new Date('2026-01-12'),
        items: [{ name: 'Sony WH-1000XM5', qty: 1, price: 349 }]
      },
      {
        id: 3,
        orderNo: 'ORD-1003',
        customerName: 'Usman Ahmad',
        phone: '0302-3333333',
        address: 'Islamabad, ICT',
        status: 'shipped',
        createdAt: new Date('2026-01-14'),
        items: [{ name: 'MacBook Pro 16"', qty: 1, price: 2299 }]
      },
      {
        id: 4,
        orderNo: 'ORD-1004',
        customerName: 'Ayesha Malik',
        phone: '0303-4444444',
        address: 'Faisalabad, Punjab',
        status: 'delivered',
        createdAt: new Date('2026-01-05'),
        items: [
          { name: 'Nike Air Max 270', qty: 2, price: 120 },
          { name: 'T-Shirt', qty: 3, price: 15 }
        ]
      },
      {
        id: 5,
        orderNo: 'ORD-1005',
        customerName: 'Hamza Sheikh',
        phone: '0304-5555555',
        address: 'Multan, Punjab',
        status: 'cancelled',
        createdAt: new Date('2026-01-08'),
        items: [{ name: 'Samsung 4K Smart TV', qty: 1, price: 699 }]
      }
    ];
  }

  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();

    this.filteredOrders = this.orders.filter(o => {
      const matchesSearch =
        !q ||
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q);

      const matchesStatus = this.selectedStatus === 'all' || o.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.applyFilters();
  }

  openView(order: Order): void {
    this.selectedOrder = order;
    this.viewModalVisible = true;
  }

  closeView(): void {
    this.viewModalVisible = false;
    this.selectedOrder = null;
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
    }
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((sum, it) => sum + it.qty * it.price, 0);
  }

  formatPrice(amount: number): string {
    return '$' + amount.toFixed(2);
  }
}
