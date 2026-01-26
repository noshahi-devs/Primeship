import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PublicService } from '../../core/services/public.service';
import { ProductService, ProductDto } from '../../core/services/product.service';
import { Product3DViewerComponent } from '../../shared/components/product-3d-viewer/product-3d-viewer.component';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, ReactiveFormsModule, Product3DViewerComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: any[] = [];
  quantity: number = 1;
  selectedSize: string = '';
  selectedColor: string = '';
  isLoading = true;

  // New properties for enhanced functionality
  activeVisualTab: 'images' | '3d' = 'images';
  activeTab: 'description' | 'specifications' | 'reviews' = 'description';

  // Gallery items for product images
  galleryItems = [
    { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center', title: 'Main View' },
    { image: 'https://images.unsplash.com/photo-1484704849700-f032be544e0e?w=400&h=300&fit=crop&crop=center', title: 'Side View' },
    { image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=center', title: 'Back View' },
    { image: 'https://images.unsplash.com/photo-1484704849700-f032be544e0e?w=400&h=300&fit=crop&crop=center', title: 'Detail View' }
  ];

  // Key features for the product
  keyFeatures = [
    { icon: 'pi pi-volume-up', text: 'Industry-leading noise cancellation' },
    { icon: 'pi pi-clock', text: '30-hour battery life' },
    { icon: 'pi pi-hand', text: 'Touch sensor controls' },
    { icon: 'pi pi-compress', text: 'Foldable design' },
    { icon: 'pi pi-bluetooth', text: 'Bluetooth 5.0 connectivity' },
    { icon: 'pi pi-shield', text: 'Premium build quality' }
  ];

  // Default specifications if none provided
  defaultSpecs = [
    { key: 'Brand', value: 'AudioTech' },
    { key: 'Model', value: 'WH-1000XM4' },
    { key: 'Battery Life', value: '30 hours' },
    { key: 'Connectivity', value: 'Bluetooth 5.0' },
    { key: 'Weight', value: '254g' },
    { key: 'Driver Size', value: '40mm' },
    { key: 'Frequency Response', value: '4Hz-40,000Hz' },
    { key: 'Charging Time', value: '3 hours' }
  ];

  sizes: string[] = [];
  colors: string[] = [];

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
    private publicService: PublicService,
    private productService: ProductService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadProduct();
    this.loadRelatedProducts();
  }

  private loadProduct(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/home']);
      return;
    }

    this.isLoading = true;
    this.publicService.getProductBySlug(slug).subscribe({
      next: (dto: ProductDto) => {
        // Parse images
        const images = this.productService.parseImages(dto.images);

        // Parse sizes and colors
        this.sizes = this.productService.parseSizeOptions(dto.sizeOptions);
        this.colors = this.productService.parseColorOptions(dto.colorOptions);

        // Map DTO to template model
        const originalPrice = dto.resellerMaxPrice;
        const discount = dto.discountPercentage || 0;
        const price = originalPrice - (originalPrice * discount / 100);

        this.product = {
          id: dto.id,
          name: dto.name,
          slug: dto.slug,
          price: price,
          originalPrice: originalPrice,
          discount: discount,
          rating: 4.8,
          reviewCount: 156,
          image: images.length > 0 ? images[0] : 'https://via.placeholder.com/400',
          images: images.length > 0 ? images : ['https://via.placeholder.com/400'],
          inStock: dto.stockQuantity > 0,
          description: dto.description,
          fullDescription: dto.description,
          category: dto.categoryName,
          specifications: [
            { key: 'SKU', value: dto.sku },
            { key: 'Brand', value: dto.brandName || 'Store Brand' },
            { key: 'Stock', value: `${dto.stockQuantity} units` }
          ]
        };

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading product:', error);
        this.router.navigate(['/home']);
      }
    });
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
        image: 'https://images.unsplash.com/photo-1588423771023-c78a61730421?w=400&h=400&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1588423771023-c78a61730421?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1484704849700-f032be544e0e?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center'
        ],
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
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1596436889106-0938ae8f3d4b?w=400&h=400&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=400&fit=crop&crop=center'
        ],
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
        image: '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
        images: [
          '/assets/images/61BKAbqOL5L._AC_SX679_.jpg',
          '/assets/images/61ILQQaR6gL._AC_SX342_SY445_QL70_FMwebp_.webp',
          '/assets/images/61Q4jcrf1QL._AC_SX679_.jpg',
          '/assets/images/61SfoMT5tTL._AC_SX679_.jpg',
          '/assets/images/61poK+8gbbL._AC_SX679_.jpg',
          '/assets/images/61voIgc5X6L._AC_SX679_.jpg',
          '/assets/images/61xVcKqi6RL._AC_SX679_.jpg',
          '/assets/images/61aazm1BzHL._AC_SX679_.jpg',
          '/assets/images/61c04TQQ2sL._AC_SY300_SX300_QL70_FMwebp_.webp'
        ],
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
        image: '/assets/images/61UxuajI+6L._AC_SY300_SX300_QL70_FMwebp_.webp',
        images: [
          '/assets/images/61UxuajI+6L._AC_SY300_SX300_QL70_FMwebp_.webp',
          '/assets/images/61ZY6ZP0V6L._AC_SL1024_.jpg',
          '/assets/images/61aazm1BzHL._AC_SX679_.jpg',
          '/assets/images/61c04TQQ2sL._AC_SY300_SX300_QL70_FMwebp_.webp',
          '/assets/images/61poK+8gbbL._AC_SX679_.jpg',
          '/assets/images/61voIgc5X6L._AC_SX679_.jpg',
          '/assets/images/61xVcKqi6RL._AC_SX679_.jpg',
          '/assets/images/61aazm1BzHL._AC_SX679_.jpg'
        ],
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

  // Additional properties for related products
  isLoadingMore = false;
  allRelatedProducts: Product[] = [];
  showAllProducts = false;
  maxProductsToShow = 8;

  // Calculate savings amount
  calculateSavings(): number {
    if (this.product?.originalPrice && this.product?.price) {
      return this.product.originalPrice - this.product.price;
    }
    return 0;
  }

  // Load all related products functionality
  loadAllRelatedProducts(): void {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;

    // Simulate API call to load more products
    setTimeout(() => {
      // Generate more related products
      const additionalProducts: Product[] = [
        {
          id: 'prod-6',
          name: 'Premium Laptop Stand',
          slug: 'premium-laptop-stand',
          price: 45,
          originalPrice: 65,
          discount: 31,
          rating: 4,
          reviewCount: 92,
          image: 'https://images.unsplash.com/photo-1495195129634-1c8223c661a5?w=400&h=400&fit=crop&crop=center',
          images: [
            'https://images.unsplash.com/photo-1495195129634-1c8223c661a5?w=400&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1522771739844-6da8bb8a6f2b?w=400&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1541807024-5c52b6e0ef44?w=400&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1522771739844-6da8bb8a6f2b?w=400&h=400&fit=crop&crop=center'
          ],
          inStock: true,
          category: 'accessories'
        },
        {
          id: 'prod-7',
          name: 'Wireless Mouse Pro',
          slug: 'wireless-mouse-pro',
          price: 35,
          originalPrice: 49,
          discount: 29,
          rating: 4,
          reviewCount: 178,
          image: '/assets/images/71+OygNZrAL._AC_SY300_SX300_QL70_FMwebp_.webp',
          images: [
            '/assets/images/71+OygNZrAL._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/71-zXPq240L._AC_SX679_.jpg',
            '/assets/images/712kZm3lUrL._AC_SX569_.jpg',
            '/assets/images/714GmQZ2ajL._AC_SX679_.jpg',
            '/assets/images/714VskeFpuL._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/714bnp4jQrL._AC_SX679_.jpg',
            '/assets/images/7155EbXa3XL._AC_SX679_.jpg',
            '/assets/images/719IAodt0BL._AC_SX679_.jpg'
          ],
          inStock: true,
          category: 'electronics'
        },
        {
          id: 'prod-8',
          name: 'Desk Organizer Set',
          slug: 'desk-organizer-set',
          price: 25,
          originalPrice: 39,
          discount: 36,
          rating: 4,
          reviewCount: 145,
          image: '/assets/images/719mDH9AeWL._AC_SY300_SX300_QL70_FMwebp_.webp',
          images: [
            '/assets/images/719mDH9AeWL._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/71E1W-DNv0L._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/71J6P8L6ORL._AC_SX679_.jpg',
            '/assets/images/71KSGYZbdtL._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/71LMMCG-7hL._AC_SY300_SX300_QL70_FMwebp_.webp',
            '/assets/images/71NpF4JP7HL._AC_SY879_.jpg',
            '/assets/images/71NsPQ4s+YL._AC_SX679_.jpg',
            '/assets/images/71SoZVYSBOL._AC_SY300_SX300_QL70_FMwebp_.webp'
          ],
          inStock: true,
          category: 'office'
        },
        {
          id: 'prod-9',
          name: 'Smart Watch Ultra',
          slug: 'smart-watch-ultra',
          price: 199,
          originalPrice: 299,
          discount: 33,
          rating: 5,
          reviewCount: 267,
          image: '/assets/images/71UFvYabRgL._AC_SX679_.jpg',
          images: [
            '/assets/images/71UFvYabRgL._AC_SX679_.jpg',
            '/assets/images/71Uz43WTZvL._AC_SX300_SY300_QL70_FMwebp_.webp',
            '/assets/images/71VaQ-OzOJL._AC_SX679_.jpg',
            '/assets/images/71W9QedOpeL._AC_SX300_SY300_QL70_FMwebp_.webp',
            '/assets/images/71WVHwqiT7L._AC_SX679_.jpg',
            '/assets/images/71Ws7+28JKL._AC_SX300_SY300_QL70_FMwebp_.webp',
            '/assets/images/71Ws7+28JKL._AC_SX679_.jpg',
            '/assets/images/71YfNeRANhL._AC_SY300_SX300_QL70_FMwebp_.webp'
          ],
          inStock: true,
          category: 'electronics'
        }
      ];

      // Combine existing and new products
      this.allRelatedProducts = [...this.relatedProducts, ...additionalProducts];
      this.relatedProducts = this.allRelatedProducts;
      this.showAllProducts = true;
      this.isLoadingMore = false;
    }, 1500);
  }

  // Toggle between showing limited and all products
  toggleViewAll(): void {
    if (!this.showAllProducts) {
      this.loadAllRelatedProducts();
    } else {
      // Show only limited products
      this.relatedProducts = this.allRelatedProducts.slice(0, this.maxProductsToShow);
      this.showAllProducts = false;
    }
  }

  // Select image for carousel
  selectImage(product: Product, imageIndex: number): void {
    // Update the main image to show the selected one
    if (product.images && product.images[imageIndex]) {
      product.image = product.images[imageIndex];
    }
  }
}
