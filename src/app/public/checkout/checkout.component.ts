import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from '../cart/cart.component';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  tax = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      paymentMethod: ['credit', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

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
          image: 'https://via.placeholder.com/100'
        },
        quantity: 1,
        size: 'M',
        color: 'Black'
      }
    ];
  }

  private calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.shipping = this.subtotal > 50 ? 0 : 10;
    this.tax = this.subtotal * 0.08;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // TODO: Process order
      console.log('Order submitted:', this.checkoutForm.value);
      alert('Order placed successfully!');
      this.router.navigate(['/account/orders']);
    } else {
      alert('Please fill in all required fields');
    }
  }
}
