import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
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
    this.loadRelatedProducts();
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
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
      images: [
        'https://images.unsplash.com/photo-1484704849700-f032be544e0e?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1484704849700-f032be544e0e?w=400&h=400&fit=crop&crop=center'
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

  private loadRelatedProducts(): void {
    // TODO: Replace with actual API call
    this.relatedProducts = [
      {
        id: 'prod-2',
        name: 'Wireless Earbuds Pro',
        slug: 'wireless-earbuds-pro',
        price: 199,
        originalPrice: 249,
        discount: 20,
        rating: 4,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1588423771023-c78a61730421?w=200&h=200&fit=crop&crop=center',
        inStock: true,
        category: 'electronics'
      },
      {
        id: 'prod-3',
        name: 'Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        price: 89,
        originalPrice: 129,
        discount: 31,
        rating: 4,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center',
        inStock: true,
        category: 'electronics'
      },
      {
        id: 'prod-4',
        name: 'Phone Case Premium',
        slug: 'phone-case-premium',
        price: 29,
        originalPrice: 39,
        discount: 26,
        rating: 4,
        reviewCount: 234,
        image: 'https://images.unsplash.com/photo-1596436889106-0938ae8f3d4b?w=200&h=200&fit=crop&crop=center',
        inStock: true,
        category: 'accessories'
      },
      {
        id: 'prod-5',
        name: 'USB-C Cable Fast',
        slug: 'usb-c-cable-fast',
        price: 15,
        originalPrice: 25,
        discount: 40,
        rating: 4,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center',
        inStock: true,
        category: 'accessories'
      }
    ];
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
    if (this.product) {
      // TODO: Implement cart service
      console.log('Adding to cart:', {
        product: this.product,
        quantity: this.quantity,
        size: this.selectedSize,
        color: this.selectedColor
      });
      
      // Navigate directly to checkout with product
      this.router.navigate(['/checkout'], { 
        queryParams: { 
          productId: this.product.id,
          quantity: this.quantity,
          size: this.selectedSize,
          color: this.selectedColor
        }
      });
    }
  }

  buyNow(): void {
    if (this.product) {
      // TODO: Implement buy now functionality (direct checkout)
      console.log('Buy now:', {
        product: this.product,
        quantity: this.quantity,
        size: this.selectedSize,
        color: this.selectedColor
      });
      
      // Navigate to checkout with product
      this.router.navigate(['/checkout'], { 
        queryParams: { 
          productId: this.product.id,
          quantity: this.quantity,
          size: this.selectedSize,
          color: this.selectedColor
        }
      });
    }
  }

  onRelatedProductClick(product: Product): void {
    this.router.navigate(['/product', product.slug]);
  }

  addToWishlist(): void {
    if (this.product) {
      // TODO: Implement wishlist service
      console.log('Adding to wishlist:', this.product);
      alert('Product added to wishlist!');
    }
  }
}
