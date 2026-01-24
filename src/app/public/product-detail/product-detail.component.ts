import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  selectedSize: string = '';
  selectedColor: string = '';
  isLoading = true;
  
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  
  reviews = [
    {
      author: 'John Doe',
      rating: 5,
      date: '2024-01-15',
      content: 'Great product! Exactly as described and fast shipping.'
    },
    {
      author: 'Jane Smith',
      rating: 4,
      date: '2024-01-10',
      content: 'Good quality, but sizing runs a bit small.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    
    // TODO: Replace with actual API call
    this.product = {
      id: 'prod-1',
      name: 'Premium Wireless Headphones',
      slug: slug || 'premium-wireless-headphones',
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4,
      reviewCount: 245,
      image: 'https://via.placeholder.com/400',
      images: [
        'https://via.placeholder.com/400',
        'https://via.placeholder.com/400',
        'https://via.placeholder.com/400'
      ],
      inStock: true,
      description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
      fullDescription: 'Experience premium sound quality with our wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and comfortable over-ear design.',
      specifications: [
        { key: 'Brand', value: 'AudioTech' },
        { key: 'Model', value: 'WH-1000XM4' },
        { key: 'Battery Life', value: '30 hours' },
        { key: 'Connectivity', value: 'Bluetooth 5.0' },
        { key: 'Weight', value: '254g' }
      ]
    };
    
    this.isLoading = false;
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.selectedSize && this.selectedColor) {
      // TODO: Implement cart service
      console.log('Adding to cart:', {
        product: this.product,
        quantity: this.quantity,
        size: this.selectedSize,
        color: this.selectedColor
      });
      
      // Show success message
      alert('Product added to cart!');
    } else {
      alert('Please select size and color');
    }
  }

  addToWishlist(): void {
    if (this.product) {
      // TODO: Implement wishlist service
      console.log('Adding to wishlist:', this.product);
      alert('Product added to wishlist!');
    }
  }
}
