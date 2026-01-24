import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

export interface CartItem {
  product: any;
  quantity: number;
  size: string;
  color: string;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  tax = 0;
  discount = 0;
  total = 0;
  promoCode = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
  }

  private loadCartItems(): void {
    // TODO: Replace with actual cart service
    this.cartItems = [
      {
        product: {
          id: 'prod-1',
          name: 'Premium Wireless Headphones',
          price: 299,
          originalPrice: 399,
          image: 'https://via.placeholder.com/100'
        },
        quantity: 1,
        size: 'M',
        color: 'Black'
      },
      {
        product: {
          id: 'prod-2',
          name: 'Smart Watch',
          price: 199,
          originalPrice: 249,
          image: 'https://via.placeholder.com/100'
        },
        quantity: 2,
        size: 'L',
        color: 'Silver'
      }
    ];
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= 10) {
      item.quantity = newQuantity;
      this.calculateTotals();
    }
  }

  removeFromCart(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.calculateTotals();
  }

  applyPromoCode(): void {
    if (this.promoCode === 'SAVE10') {
      this.discount = this.subtotal * 0.1;
      this.calculateTotals();
      alert('Promo code applied! 10% discount');
    } else {
      alert('Invalid promo code');
    }
  }

  private calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.shipping = this.subtotal > 50 ? 0 : 10;
    this.tax = this.subtotal * 0.08;
    this.total = this.subtotal + this.shipping + this.tax - this.discount;
  }
}
