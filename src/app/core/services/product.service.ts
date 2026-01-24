import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor() { }

  getProducts(): Observable<Product[]> {
    // TODO: Replace with actual API call
    const products: Product[] = Array(20).fill(0).map((_, i) => ({
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
    
    return of(products);
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    // TODO: Replace with actual API call
    const product: Product = {
      id: 'prod-1',
      name: 'Premium Product',
      slug: slug,
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
      description: 'Premium product description',
      fullDescription: 'Detailed product description with all features and benefits.',
      specifications: [
        { key: 'Brand', value: 'PremiumBrand' },
        { key: 'Model', value: 'PRO-001' }
      ]
    };
    
    return of(product);
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    // TODO: Replace with actual API call
    return this.getProducts();
  }

  getFeaturedProducts(): Observable<Product[]> {
    // TODO: Replace with actual API call
    return this.getProducts();
  }

  getLatestProducts(): Observable<Product[]> {
    // TODO: Replace with actual API call
    return this.getProducts();
  }

  searchProducts(query: string): Observable<Product[]> {
    // TODO: Replace with actual API call
    return this.getProducts();
  }

  getCategories(): Observable<Category[]> {
    // TODO: Replace with actual API call
    const categories: Category[] = [
      { id: '1', name: 'Electronics', slug: 'electronics', image: 'assets/images/categories/electronics.jpg' },
      { id: '2', name: 'Fashion', slug: 'fashion', image: 'assets/images/categories/fashion.jpg' },
      { id: '3', name: 'Home & Living', slug: 'home-living', image: 'assets/images/categories/home.jpg' },
      { id: '4', name: 'Beauty', slug: 'beauty', image: 'assets/images/categories/beauty.jpg' },
      { id: '5', name: 'Sports', slug: 'sports', image: 'assets/images/categories/sports.jpg' }
    ];
    
    return of(categories);
  }
}
