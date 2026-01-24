import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../core/services';
import { Category, Product } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  latestProducts: Product[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadLatestProducts();
  }

  private loadCategories(): void {
    // TODO: Replace with actual API call
    this.categories = [
      { id: '1', name: 'Electronics', slug: 'electronics', image: 'assets/images/categories/electronics.jpg' },
      { id: '2', name: 'Fashion', slug: 'fashion', image: 'assets/images/categories/fashion.jpg' },
      { id: '3', name: 'Home & Living', slug: 'home-living', image: 'assets/images/categories/home.jpg' },
      { id: '4', name: 'Beauty', slug: 'beauty', image: 'assets/images/categories/beauty.jpg' },
      { id: '5', name: 'Sports', slug: 'sports', image: 'assets/images/categories/sports.jpg' },
    ];
  }

  private loadFeaturedProducts(): void {
    // TODO: Replace with actual API call
    this.featuredProducts = Array(8).fill(0).map((_, i) => ({
      id: `feat-${i + 1}`,
      name: `Featured Product ${i + 1}`,
      slug: `featured-product-${i + 1}`,
      price: Math.floor(Math.random() * 900) + 100,
      originalPrice: Math.floor(Math.random() * 1200) + 100,
      discount: Math.floor(Math.random() * 40) + 10,
      rating: Math.floor(Math.random() * 3) + 2,
      reviewCount: Math.floor(Math.random() * 1000),
      image: 'https://via.placeholder.com/200',
      inStock: true,
      isFeatured: true
    }));
  }

  private loadLatestProducts(): void {
    // TODO: Replace with actual API call
    this.latestProducts = Array(8).fill(0).map((_, i) => ({
      id: `latest-${i + 1}`,
      name: `Latest Product ${i + 1}`,
      slug: `latest-product-${i + 1}`,
      price: Math.floor(Math.random() * 900) + 100,
      originalPrice: Math.floor(Math.random() * 1200) + 100,
      discount: Math.floor(Math.random() * 40) + 10,
      rating: Math.floor(Math.random() * 3) + 2,
      reviewCount: Math.floor(Math.random() * 1000),
      image: 'https://via.placeholder.com/200',
      inStock: true,
      isNew: true
    }));
    
    this.isLoading = false;
  }

  onCategorySelected(category: Category): void {
    this.router.navigate(['/category', category.slug]);
  }

  onProductSelected(product: Product): void {
    this.router.navigate(['/product', product.slug]);
  }
}
