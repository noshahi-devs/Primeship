import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PublicService } from '../../core/services/public.service';
import { ProductService, ProductDto } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, ButtonModule],
  template: `
    <div class="shop-view animate-fade">
      <div class="container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumb-nav">
          <a routerLink="/">Home</a>
          <i class="pi pi-chevron-right"></i>
          <span>{{ categoryName || 'Explore Products' }}</span>
        </nav>

        <div class="shop-header">
          <div class="header-content">
            <h1>{{ categoryName || 'Premium' }} <span>Collection</span></h1>
            <p>Discover high-performance products selected for quality and style.</p>
          </div>
          
          <div class="shop-controls shadow-sm">
            <div class="search-box">
              <i class="pi pi-search"></i>
              <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Find something specific...">
            </div>
            
            <div class="sort-box">
              <span>Sort by:</span>
              <select [(ngModel)]="sortBy" (change)="onSort()">
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        <div class="shop-layout">
          <!-- Sidebar Filters -->
          <aside class="shop-sidebar">
            <div class="filter-group">
              <h3>Categories</h3>
              <div class="category-links">
                <a [class.active]="!currentCategorySlug" routerLink="/shop">All Products</a>
                <a *ngFor="let cat of categories" 
                   [class.active]="currentCategorySlug === cat.slug"
                   [routerLink]="['/category', cat.slug]">
                  {{ cat.name }}
                </a>
              </div>
            </div>

            <div class="filter-group">
              <h3>Price Range</h3>
              <div class="price-inputs">
                <div class="range-display">Up to \${{ maxPriceFilter }}</div>
                <input type="range" min="0" max="2500" step="50" [(ngModel)]="maxPriceFilter" (input)="onSort()">
              </div>
            </div>
          </aside>

          <!-- Product Grid -->
          <main class="shop-main">
            <div class="products-grid" *ngIf="!isLoading; else loader">
              <div class="pro-card-premium" *ngFor="let p of filteredProducts">
                <div class="pro-img-box">
                  <img [src]="getFirstImage(p)" [alt]="p.name">
                  <span class="badge-tag" *ngIf="p.discountPercentage > 0">-{{ p.discountPercentage }}%</span>
                  
                  <div class="pro-actions-overlay">
                    <button class="btn-circle"><i class="pi pi-heart"></i></button>
                    <button class="btn-circle" (click)="onProductClick(p)"><i class="pi pi-eye"></i></button>
                  </div>
                </div>
                <div class="pro-info" (click)="onProductClick(p)">
                  <span class="category-label">{{ p.categoryName }}</span>
                  <h3>{{ p.name }}</h3>
                  <div class="price-row">
                    <div class="prices">
                      <span class="current">\${{ getDiscountedPrice(p) | number:'1.2-2' }}</span>
                      <span class="old" *ngIf="p.discountPercentage > 0">\${{ p.resellerMaxPrice | number:'1.2-2' }}</span>
                    </div>
                  </div>
                  <div class="rating-block">
                    <div class="stars">★★★★★</div>
                    <span class="count">124 reviews</span>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #loader>
              <div class="loader-container">
                <i class="pi pi-spin pi-spinner"></i>
                <p>Loading collection...</p>
              </div>
            </ng-template>

            <div class="no-results" *ngIf="!isLoading && filteredProducts.length === 0">
              <i class="pi pi-search-plus"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button class="btn-premium" (click)="clearFilters()">Clear All Filters</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-view { padding: 4rem 0; background: #f8fafc; min-height: 100vh; }
    .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
    
    .breadcrumb-nav { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; font-size: 14px; color: #64748b; }
    .breadcrumb-nav a { color: var(--primary); text-decoration: none; font-weight: 500; }

    .shop-header { margin-bottom: 3rem; }
    .header-content h1 { font-size: 3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
    .header-content h1 span { color: var(--primary); }
    .header-content p { color: #64748b; font-size: 1.1rem; }

    .shop-controls { 
      margin-top: 2rem; 
      background: #fff; 
      padding: 1rem 2rem; 
      border-radius: 20px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      gap: 2rem;
    }

    .search-box { flex: 1; position: relative; display: flex; align-items: center; }
    .search-box i { position: absolute; left: 1rem; color: #94a3b8; }
    .search-box input { 
      width: 100%; 
      padding: 0.75rem 1rem 0.75rem 3rem; 
      border: 1px solid #e2e8f0; 
      border-radius: 12px; 
      outline: none; 
      transition: all 0.3s;
    }
    .search-box input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(248,86,6,0.1); }

    .sort-box { display: flex; align-items: center; gap: 1rem; white-space: nowrap; }
    .sort-box select { padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; }

    .shop-layout { display: grid; grid-template-columns: 280px 1fr; gap: 4rem; }

    .filter-group { margin-bottom: 3rem; }
    .filter-group h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }

    .category-links { display: flex; flex-direction: column; gap: 0.75rem; }
    .category-links a { 
      text-decoration: none; 
      color: #64748b; 
      font-weight: 500; 
      padding: 0.5rem 0; 
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .category-links a:hover, .category-links a.active { color: var(--primary); transform: translateX(5px); }
    .category-links a.active { font-weight: 700; }

    .price-inputs { padding: 0 0.5rem; }
    .range-display { font-weight: 700; color: var(--primary); margin-bottom: 1rem; font-size: 1.25rem; }
    input[type="range"] { width: 100%; accent-color: var(--primary); }

    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }

    /* Product Card Re-used & Enhanced */
    .pro-card-premium { background: #fff; border-radius: 20px; overflow: hidden; transition: all 0.4s; border: 1px solid #f1f5f9; cursor: pointer; }
    .pro-card-premium:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

    .pro-img-box { height: 320px; position: relative; background: #f8fafc; overflow: hidden; }
    .pro-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
    .pro-card-premium:hover .pro-img-box img { transform: scale(1.1); }

    .badge-tag { position: absolute; top: 20px; left: 20px; background: #ff4757; color: #fff; padding: 6px 14px; border-radius: 30px; font-weight: 800; font-size: 12px; box-shadow: 0 4px 12px rgba(255,71,87,0.3); }

    .pro-actions-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; gap: 1rem; opacity: 0; transition: all 0.3s; backdrop-filter: blur(2px); }
    .pro-card-premium:hover .pro-actions-overlay { opacity: 1; }

    .btn-circle { width: 45px; height: 45px; background: #fff; border: none; border-radius: 50%; color: #1e293b; display: flex; align-items: center; justify-content: center; transition: all 0.3s; cursor: pointer; }
    .btn-circle:hover { background: var(--primary); color: #fff; transform: scale(1.1); }

    .pro-info { padding: 1.5rem; }
    .category-label { font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
    .pro-info h3 { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0.5rem 0 1rem; }
    
    .price-row .current { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-right: 0.75rem; }
    .price-row .old { color: #94a3b8; text-decoration: line-through; font-size: 1rem; }

    .rating-block { display: flex; align-items: center; gap: 8px; margin-top: 1rem; }
    .stars { color: #f59e0b; letter-spacing: 2px; }
    .count { font-size: 12px; color: #94a3b8; font-weight: 500; }

    .loader-container, .no-results { padding: 8rem 0; text-align: center; }
    .loader-container i { font-size: 3rem; color: var(--primary); margin-bottom: 2rem; }
    .no-results i { font-size: 4rem; color: #cbd5e1; margin-bottom: 25px; }
    .no-results h3 { font-size: 1.75rem; color: #1e293b; margin-bottom: 10px; }
    .no-results p { color: #64748b; margin-bottom: 30px; }
  `]
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  categories: any[] = [];
  isLoading = true;
  categoryName = '';
  currentCategorySlug = '';

  // Filters
  searchTerm = '';
  sortBy = 'newest';
  maxPriceFilter = 2500;

  constructor(
    private publicService: PublicService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      this.currentCategorySlug = params.get('slug') || '';
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.publicService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadProducts(): void {
    console.log('🏁 ProductListComponent: Loading products...');
    this.isLoading = true;
    this.publicService.getProducts().subscribe({
      next: (data) => {
        console.log('📦 ProductListComponent: Data received:', data);
        this.products = data || [];
        this.applyFilters();
        this.isLoading = false;
        console.log('✅ ProductListComponent: Finished loading products. Count:', this.filteredProducts.length);

        if (this.currentCategorySlug) {
          const cat = this.categories.find(c => this.productService.generateSlug(c.name) === this.currentCategorySlug);
          this.categoryName = cat ? cat.name : 'Category';
        } else {
          this.categoryName = '';
        }
      },
      error: (err) => {
        console.error('❌ ProductListComponent: Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.products];

    // Category Filter
    if (this.currentCategorySlug) {
      result = result.filter(p => this.productService.generateSlug(p.categoryName) === this.currentCategorySlug);
    }

    // Search Filter
    if (this.searchTerm) {
      const lower = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.categoryName?.toLowerCase().includes(lower)
      );
    }

    // Price Filter
    result = result.filter(p => this.getDiscountedPrice(p) <= this.maxPriceFilter);

    // Sorting
    switch (this.sortBy) {
      case 'price-low':
        result.sort((a, b) => this.getDiscountedPrice(a) - this.getDiscountedPrice(b));
        break;
      case 'price-high':
        result.sort((a, b) => this.getDiscountedPrice(b) - this.getDiscountedPrice(a));
        break;
      case 'popular':
        // Dummy popularity
        result.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
        break;
      case 'newest':
      default:
        // Already sorted by newest from API usually, but let's be safe
        break;
    }

    this.filteredProducts = result;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSort(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'newest';
    this.maxPriceFilter = 2500;
    this.applyFilters();
  }

  getFirstImage(p: ProductDto): string {
    const images = this.productService.parseImages(p.images);
    return images.length > 0 ? images[0] : 'https://via.placeholder.com/400x400?text=No+Image';
  }

  getDiscountedPrice(p: ProductDto): number {
    const original = p.resellerMaxPrice || 0;
    const discount = p.discountPercentage || 0;
    return original - (original * discount / 100);
  }

  onProductClick(p: ProductDto): void {
    this.router.navigate(['/product', p.slug]);
  }
}
