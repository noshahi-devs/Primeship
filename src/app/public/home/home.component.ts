import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../core/services';
import { Category, Product } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  latestProducts: Product[] = [];
  isLoading = true;
  flashSaleTime = { hours: 12, minutes: 45, seconds: 30 };

  // Pagination for products
  visibleFeaturedCount = 8;
  visibleLatestCount = 8;
  readonly PRODUCTS_PER_LOAD = 8;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.startCountdown();
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadLatestProducts();
  }

  private startCountdown() {
    setInterval(() => {
      if (this.flashSaleTime.seconds > 0) {
        this.flashSaleTime.seconds--;
      } else {
        this.flashSaleTime.seconds = 59;
        if (this.flashSaleTime.minutes > 0) {
          this.flashSaleTime.minutes--;
        } else {
          this.flashSaleTime.minutes = 59;
          if (this.flashSaleTime.hours > 0) {
            this.flashSaleTime.hours--;
          }
        }
      }
    }, 1000);
  }

  private loadCategories(): void {
    // High-end categorized imagery from existing assets & unsplash mix
    this.categories = [
      { id: '1', name: 'Electronics', slug: 'electronics', image: 'assets/images/61+DG4Np+zL._AC_SX425_.jpg' },
      { id: '2', name: 'Fashion', slug: 'fashion', image: 'assets/images/71NpF4JP7HL._AC_SY879_.jpg' },
      { id: '3', name: 'Beauty', slug: 'beauty', image: 'assets/images/81BrD6Y4ieL._AC_SX425_.jpg' },
      { id: '4', name: 'Home Living', slug: 'home-living', image: 'assets/images/81jgetrp87L._AC_SX679_.jpg' },
      { id: '5', name: 'Activewear', slug: 'sports', image: 'assets/images/81ec6uY7eML._AC_SX425_.jpg' },
      { id: '6', name: 'Accessories', slug: 'accessories', image: 'assets/images/61BKAbqOL5L._AC_SX679_.jpg' },
    ];
  }

  private loadFeaturedProducts(): void {
    const assetImages = [
      'assets/images/91NNZo3825L._AC_SX679_.jpg',
      'assets/images/91P2724BW3L._AC_SX679_.jpg',
      'assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg',
      'assets/images/81OT48ieUNL._AC_SL1500_.jpg',
      'assets/images/81eUg-ixCSL._AC_SX679_.jpg',
      'assets/images/71J6P8L6ORL._AC_SX679_.jpg'
    ];

    const proNames = ['Aura Wireless Pro', 'Eclipse Smartwatch', 'Urban Explorer Tote', 'Velvet Matt Lipstick', 'Nordic Desk Lamp', 'Prime Fit Sneakers'];
    const proCats = ['Electronics', 'Electronics', 'Fashion', 'Beauty', 'Home Living', 'Activewear'];

    // Generate more products to simulate large inventory
    const allProducts: Product[] = [];
    for (let batch = 0; batch < 20; batch++) {
      proNames.forEach((name, i) => {
        allProducts.push({
          id: `feat-${batch}-${i + 1}`,
          name: `${name} ${batch > 0 ? 'Series ' + batch : ''}`,
          category: proCats[i] as any,
          slug: `${name.toLowerCase().replace(/ /g, '-')}-${batch}-${i}`,
          price: [299, 199, 89, 29, 149, 120][i] + (batch * 10),
          originalPrice: [399, 249, 120, 45, 199, 150][i] + (batch * 10),
          discount: Math.floor(Math.random() * 20) + 10,
          rating: 4.8,
          reviewCount: 1240,
          image: assetImages[i] || 'assets/images/placeholder.jpg',
          inStock: true,
          isFeatured: true
        });
      });
    }

    this.featuredProducts = allProducts;
  }

  private loadLatestProducts(): void {
    // Mix of latest product images from assets
    const latestImages = [
      'assets/images/71Xa0fzUiGL._AC_SX679_.jpg',
      'assets/images/71buRMyGhJL._AC_SY300_SX300_QL70_FMwebp_.webp',
      'assets/images/71dY1KlUS3L._AC_SX679_.jpg',
      'assets/images/71fJxIg1yZL._AC_SX569_.jpg',
      'assets/images/81ViBxtYFoL._AC_SX569_.jpg',
      'assets/images/81j8RchuiLL._AC_SX679_.jpg',
      'assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
      'assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp'
    ];

    // Generate more products
    const allLatest: Product[] = [];
    for (let batch = 0; batch < 15; batch++) {
      latestImages.forEach((img, i) => {
        allLatest.push({
          id: `latest-${batch}-${i + 1}`,
          name: `Premium Selection ${batch * 8 + i + 1}`,
          category: 'Exquisite' as any,
          slug: `exquisite-product-${batch}-${i + 1}`,
          price: Math.floor(Math.random() * 500) + 50,
          originalPrice: Math.floor(Math.random() * 700) + 100,
          discount: 15,
          rating: 4.5,
          reviewCount: 300,
          image: img,
          inStock: true,
          isNew: true
        });
      });
    }

    this.latestProducts = allLatest;
    this.isLoading = false;
  }

  get visibleFeaturedProducts(): Product[] {
    return this.featuredProducts.slice(0, this.visibleFeaturedCount);
  }

  get visibleLatestProducts(): Product[] {
    return this.latestProducts.slice(0, this.visibleLatestCount);
  }

  get canLoadMoreFeatured(): boolean {
    return this.visibleFeaturedCount < this.featuredProducts.length;
  }

  get canLoadMoreLatest(): boolean {
    return this.visibleLatestCount < this.latestProducts.length;
  }

  loadMoreFeatured(): void {
    this.visibleFeaturedCount += this.PRODUCTS_PER_LOAD;
  }

  loadMoreLatest(): void {
    this.visibleLatestCount += this.PRODUCTS_PER_LOAD;
  }

  onCategorySelected(category: Category): void {
    this.router.navigate(['/category', category.slug]);
  }

  onProductSelected(product: Product): void {
    this.router.navigate(['/product', product.slug]);
  }
}
