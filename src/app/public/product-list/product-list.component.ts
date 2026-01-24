import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  filtersForm: FormGroup;
  selectedCategory: string = '';
  sortBy: string = 'featured';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      category: [''],
      sortBy: ['featured'],
      minPrice: [0],
      maxPrice: [1000]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFilters();
  }

  private loadProducts(): void {
    // TODO: Replace with actual API call
    this.products = Array(12).fill(0).map((_, i) => ({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      slug: `product-${i + 1}`,
      price: Math.floor(Math.random() * 900) + 100,
      originalPrice: Math.floor(Math.random() * 1200) + 100,
      discount: Math.floor(Math.random() * 40) + 10,
      rating: Math.floor(Math.random() * 3) + 2,
      reviewCount: Math.floor(Math.random() * 1000),
      image: 'https://via.placeholder.com/200',
      inStock: true,
      category: ['electronics', 'fashion', 'home', 'beauty'][Math.floor(Math.random() * 4)]
    }));
    
    this.filteredProducts = [...this.products];
    this.isLoading = false;
  }

  private setupFilters(): void {
    this.filtersForm.valueChanges.subscribe(values => {
      this.applyFilters(values);
    });
  }

  private applyFilters(filters: any): void {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !filters.category || product.category === filters.category;
      const priceMatch = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      return categoryMatch && priceMatch;
    });

    this.sortProducts(filters.sortBy);
  }

  private sortProducts(sortBy: string): void {
    switch (sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.filteredProducts.reverse();
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onProductClick(product: Product): void {
    this.router.navigate(['/product', product.slug]);
  }
}
