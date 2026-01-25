import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-list-fixed.html',
  styleUrls: ['./product-list-interactive.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  filtersForm: FormGroup;
  selectedCategory: string = '';
  sortBy: string = 'featured';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };
  categoryTitle: string = '';
  categoryDescription: string = '';
  categoryImage: string = '';

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
    this.route.params.subscribe(params => {
      this.selectedCategory = params['slug'];
      this.loadCategoryProducts();
      this.setupFilters();
    });
  }

  private loadCategoryProducts(): void {
    // Category-specific data with beautiful products and images
    const categoryData: { [key: string]: { title: string; description: string; image: string; products: Product[] } } = {
      'electronics': {
        title: 'Premium Electronics',
        description: 'Cutting-edge technology and innovative gadgets for modern lifestyle',
        image: '/assets/images/61+DG4Np+zL._AC_SX425_.jpg',
        products: [
          {
            id: 'electronics-1',
            name: 'Premium Wireless Headphones Pro Max',
            slug: 'premium-wireless-headphones-pro-max',
            price: 599,
            originalPrice: 899,
            discount: 33,
            rating: 5,
            reviewCount: 2847,
            image: '/assets/images/61+DG4Np+zL._AC_SX425_.jpg',
            images: [
              '/assets/images/61+DG4Np+zL._AC_SX425_.jpg',
              '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
              '/assets/images/61UxuajI+6L._AC_SY300_SY300_QL70_FMwebp_.webp',
              '/assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg'
            ],
            inStock: true,
            category: 'electronics'
          },
          {
            id: 'electronics-2',
            name: 'Smart Home Automation System',
            slug: 'smart-home-automation-system',
            price: 1299,
            originalPrice: 1899,
            discount: 32,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/81jgetrp87L._AC_SX679_.jpg',
            images: [
              '/assets/images/81jgetrp87L._AC_SX679_.jpg',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'electronics'
          },
          {
            id: 'electronics-3',
            name: 'Professional Camera Kit',
            slug: 'professional-camera-kit',
            price: 2499,
            originalPrice: 3499,
            discount: 29,
            rating: 5,
            reviewCount: 892,
            image: '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
            images: [
              '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
              '/assets/images/81eUg-ixCSL._AC_SX679_.jpg',
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'electronics'
          },
          {
            id: 'electronics-3',
            name: 'Professional Camera Kit',
            slug: 'professional-camera-kit',
            price: 2499,
            originalPrice: 3499,
            discount: 29,
            rating: 5,
            reviewCount: 892,
            image: '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
            images: [
              '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
              '/assets/images/81eUg-ixCSL._AC_SX679_.jpg',
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'electronics'
          },
          {
            id: 'electronics-4',
            name: 'Gaming Laptop Elite',
            slug: 'gaming-laptop-elite',
            price: 1799,
            originalPrice: 2499,
            discount: 28,
            rating: 5,
            reviewCount: 2156,
            image: '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
            images: [
              '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
              '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'electronics'
          }
        ]
      },
      'fashion': {
        title: 'Luxury Fashion',
        description: 'Elegant designs and premium materials for sophisticated style',
        image: '/assets/images/71NpF4JP7HL._AC_SY879_.jpg',
        products: [
          {
            id: 'fashion-1',
            name: 'Designer Leather Handbag Collection',
            slug: 'designer-leather-handbag-collection',
            price: 1299,
            originalPrice: 1899,
            discount: 32,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/71NpF4JP7HL._AC_SY879_.jpg',
            images: [
              '/assets/images/71NpF4JP7HL._AC_SY879_.jpg',
              '/assets/images/71UFvYabRgL._AC_SX679_.jpg',
              '/assets/images/71VaQ-OzOJL._AC_SX679_.jpg',
              '/assets/images/71W9QedOpeL._AC_SX300_SY300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'fashion'
          },
          {
            id: 'fashion-2',
            name: 'Premium Silk Evening Gown',
            slug: 'premium-silk-evening-gown',
            price: 899,
            originalPrice: 1299,
            discount: 31,
            rating: 5,
            reviewCount: 892,
            image: '/assets/images/71UFvYabRgL._AC_SX679_.jpg',
            images: [
              '/assets/images/71UFvYabRgL._AC_SX679_.jpg',
              '/assets/images/71VaQ-OzOJL._AC_SX679_.jpg',
              '/assets/images/71W9QedOpeL._AC_SX300_SY300_QL70_FMwebp_.webp',
              '/assets/images/71Ws7+28JKL._AC_SX300_SY300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'fashion'
          },
          {
            id: 'fashion-3',
            name: 'Italian Leather Shoes Premium',
            slug: 'italian-leather-shoes-premium',
            price: 599,
            originalPrice: 899,
            discount: 33,
            rating: 5,
            reviewCount: 1876,
            image: '/assets/images/71VaQ-OzOJL._AC_SX679_.jpg',
            images: [
              '/assets/images/71VaQ-OzOJL._AC_SX679_.jpg',
              '/assets/images/71W9QedOpeL._AC_SX300_SY300_QL70_FMwebp_.webp',
              '/assets/images/71Ws7+28JKL._AC_SX300_SY300_QL70_FMwebp_.webp',
              '/assets/images/71YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'fashion'
          },
          {
            id: 'fashion-4',
            name: 'Luxury Watch Collection',
            slug: 'luxury-watch-collection',
            price: 3499,
            originalPrice: 4999,
            discount: 30,
            rating: 5,
            reviewCount: 3421,
            image: '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
            images: [
              '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
              '/assets/images/61ILQQaR6gL._AC_SX342_SY445_QL70_FMwebp_.webp',
              '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'fashion'
          }
        ]
      },
      'beauty': {
        title: 'Beauty & Skincare',
        description: 'Premium beauty products for radiant and healthy skin',
        image: '/assets/images/81BrD6Y4ieL._AC_SX425_.jpg',
        products: [
          {
            id: 'beauty-1',
            name: 'Diamond Radiance Serum Supreme',
            slug: 'diamond-radiance-serum-supreme',
            price: 299,
            originalPrice: 449,
            discount: 33,
            rating: 5,
            reviewCount: 3421,
            image: '/assets/images/81BrD6Y4ieL._AC_SX425_.jpg',
            images: [
              '/assets/images/81BrD6Y4ieL._AC_SX425_.jpg',
              '/assets/images/81j+U2EsirL._AC_SX425_.jpg',
              '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
              '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'beauty'
          },
          {
            id: 'beauty-2',
            name: 'Luxury Face Cream Premium',
            slug: 'luxury-face-cream-premium',
            price: 199,
            originalPrice: 299,
            discount: 33,
            rating: 5,
            reviewCount: 2156,
            image: '/assets/images/81j+U2EsirL._AC_SX425_.jpg',
            images: [
              '/assets/images/81j+U2EsirL._AC_SX425_.jpg',
              '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
              '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'beauty'
          },
          {
            id: 'beauty-3',
            name: 'Professional Makeup Kit',
            slug: 'professional-makeup-kit',
            price: 499,
            originalPrice: 749,
            discount: 33,
            rating: 5,
            reviewCount: 1876,
            image: '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
            images: [
              '/assets/images/81j8RchuiLL._AC_SX679_.jpg',
              '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'beauty'
          },
          {
            id: 'beauty-4',
            name: 'Anti-Aging Treatment Set',
            slug: 'anti-aging-treatment-set',
            price: 799,
            originalPrice: 1199,
            discount: 33,
            rating: 5,
            reviewCount: 2847,
            image: '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
            images: [
              '/assets/images/81mBRjySIxL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'beauty'
          }
        ]
      },
      'home-living': {
        title: 'Home & Living',
        description: 'Transform your space with elegant and functional home essentials',
        image: '/assets/images/81jgetrp87L._AC_SX679_.jpg',
        products: [
          {
            id: 'home-1',
            name: 'Smart Home Automation System Premium',
            slug: 'smart-home-automation-system-premium',
            price: 2499,
            originalPrice: 3499,
            discount: 29,
            rating: 5,
            reviewCount: 892,
            image: '/assets/images/81jgetrp87L._AC_SX679_.jpg',
            images: [
              '/assets/images/81jgetrp87L._AC_SX679_.jpg',
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'home-living'
          },
          {
            id: 'home-2',
            name: 'Luxury Furniture Collection',
            slug: 'luxury-furniture-collection',
            price: 1899,
            originalPrice: 2799,
            discount: 32,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
            images: [
              '/assets/images/81yZQ8q7-IL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81bjKYgV7XL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'home-living'
          },
          {
            id: 'home-3',
            name: 'Premium Kitchen Appliances',
            slug: 'premium-kitchen-appliances',
            price: 999,
            originalPrice: 1499,
            discount: 33,
            rating: 5,
            reviewCount: 2156,
            image: '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
            images: [
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81bjKYgV7XL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81c0N5xbPFL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'home-living'
          },
          {
            id: 'home-4',
            name: 'Smart Lighting System',
            slug: 'smart-lighting-system',
            price: 699,
            originalPrice: 999,
            discount: 30,
            rating: 5,
            reviewCount: 1876,
            image: '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp',
            images: [
              '/assets/images/81b-HdQGvDL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81bjKYgV7XL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81c0N5xbPFL._AC_SY300_SX300_QL70_FMwebp_.webp',
              '/assets/images/81dyFCctkyL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'home-living'
          }
        ]
      },
      'sports': {
        title: 'Sports & Fitness',
        description: 'Professional-grade equipment for peak performance and active lifestyle',
        image: '/assets/images/81ec6uY7eML._AC_SX425_.jpg',
        products: [
          {
            id: 'sports-1',
            name: 'Professional Athletic Performance Gear',
            slug: 'professional-athletic-performance-gear',
            price: 799,
            originalPrice: 1199,
            discount: 33,
            rating: 5,
            reviewCount: 2156,
            image: '/assets/images/81ec6uY7eML._AC_SX425_.jpg',
            images: [
              '/assets/images/81ec6uY7eML._AC_SX425_.jpg',
              '/assets/images/81eUg-ixCSL._AC_SX679_.jpg',
              '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg'
            ],
            inStock: true,
            category: 'sports'
          },
          {
            id: 'sports-2',
            name: 'Elite Fitness Equipment Set',
            slug: 'elite-fitness-equipment-set',
            price: 1299,
            originalPrice: 1899,
            discount: 32,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/81eUg-ixCSL._AC_SX679_.jpg',
            images: [
              '/assets/images/81eUg-ixCSL._AC_SX679_.jpg',
              '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'sports'
          },
          {
            id: 'sports-3',
            name: 'Professional Running Shoes',
            slug: 'professional-running-shoes',
            price: 299,
            originalPrice: 449,
            discount: 33,
            rating: 5,
            reviewCount: 3421,
            image: '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
            images: [
              '/assets/images/81OT48ieUNL._AC_SL1500_.jpg',
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX679_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX300_SY300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'sports'
          },
          {
            id: 'sports-4',
            name: 'Yoga and Meditation Kit',
            slug: 'yoga-meditation-kit',
            price: 199,
            originalPrice: 299,
            discount: 33,
            rating: 5,
            reviewCount: 1876,
            image: '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
            images: [
              '/assets/images/81ViBxtYFoL._AC_SX569_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX679_.jpg',
              '/assets/images/81Ws7+28JKL._AC_SX300_SY300_QL70_FMwebp_.webp',
              '/assets/images/81YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'sports'
          }
        ]
      },
      'accessories': {
        title: 'Premium Accessories',
        description: 'Stylish and functional accessories to complement your lifestyle',
        image: '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
        products: [
          {
            id: 'accessories-1',
            name: 'Swiss Movement Luxury Watch Collection',
            slug: 'swiss-movement-luxury-watch-collection',
            price: 3499,
            originalPrice: 4999,
            discount: 30,
            rating: 5,
            reviewCount: 1876,
            image: '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
            images: [
              '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
              '/assets/images/61ILQQaR6gL._AC_SX342_SY445_QL70_FMwebp_.webp',
              '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'accessories'
          },
          {
            id: 'accessories-2',
            name: 'Designer Sunglasses Premium',
            slug: 'designer-sunglasses-premium',
            price: 299,
            originalPrice: 449,
            discount: 33,
            rating: 5,
            reviewCount: 2156,
            image: '/assets/images/61ILQQaR6gL._AC_SX342_SY445_QL70_FMwebp_.webp',
            images: [
              '/assets/images/61ILQQaR6gL._AC_SX342_SY445_QL70_FMwebp_.webp',
              '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
              '/assets/images/61UxuajI+6L._AC_SY300_SY300_QL70_FMwebp_.webp'
            ],
            inStock: true,
            category: 'accessories'
          },
          {
            id: 'accessories-3',
            name: 'Premium Leather Wallet Set',
            slug: 'premium-leather-wallet-set',
            price: 199,
            originalPrice: 299,
            discount: 33,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
            images: [
              '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
              '/assets/images/61UxuajI+6L._AC_SY300_SY300_QL70_FMwebp_.webp',
              '/assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg'
            ],
            inStock: true,
            category: 'accessories'
          },{
            id: 'accessories-8',
            name: 'Premium Leather Wallet Set',
            slug: 'premium-leather-wallet-set',
            price: 199,
            originalPrice: 299,
            discount: 33,
            rating: 5,
            reviewCount: 1532,
            image: '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
            images: [
              '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
              '/assets/images/61UxuajI+6L._AC_SY300_SY300_QL70_FMwebp_.webp',
              '/assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg'
            ],
            inStock: true,
            category: 'accessories'
          },
          {
            id: 'accessories-4',
            name: 'Luxury Travel Luggage Set',
            slug: 'luxury-travel-luggage-set',
            price: 899,
            originalPrice: 1299,
            discount: 31,
            rating: 5,
            reviewCount: 892,
            image: '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
            images: [
              '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
              '/assets/images/61UxuajI+6L._AC_SY300_SY300_QL70_FMwebp_.webp',
              '/assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg',
              '/assets/images/61aazm1BzHL._AC_SX679_.jpg'
            ],
            inStock: true,
            category: 'accessories'
          }
        ]
      }
    };

    // Get category data or use default
    const data = categoryData[this.selectedCategory] || categoryData['electronics'];
    this.categoryTitle = data.title;
    this.categoryDescription = data.description;
    this.categoryImage = data.image;
    this.products = data.products;
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
