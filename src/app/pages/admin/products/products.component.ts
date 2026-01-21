import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  sku: string;
  slug: string;
  description: string;
  category: string;
  categoryId: number;
  price: number;
  discountPrice: number;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  images: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
}

interface Category {
  id: number;
  name: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('editFileInput') editFileInput!: ElementRef;

  // Modal states
  addProductModalVisible = false;
  editProductModalVisible = false;
  deleteConfirmationVisible = false;
  viewProductModalVisible = false;
  productToDelete: Product | null = null;
  selectedProduct: Product | null = null;

  // Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  // Forms
  addProductForm!: FormGroup;
  editProductForm!: FormGroup;

  // Table settings
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  searchTerm = '';
  selectedStatusFilter: string | null = null;
  selectedCategoryFilter: number | null = null;

  // Image upload
  selectedImage: string | null = null;
  imagePreviewUrls: string[] = [];
  isUploading = false;

  // Toast
  toasts: Toast[] = [];
  private toastId = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.loadDummyData();
    this.loadCategories();
    this.filterTable();
  }

  private initForms(): void {
    this.addProductForm = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      categoryId: [null, [Validators.required]],
      
      // Pricing
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      
      // Status
      status: [true],
      featured: [false],
      
      // SEO
      metaTitle: [''],
      metaDescription: ['', [Validators.maxLength(160)]]
    });

    this.editProductForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      categoryId: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: [true],
      featured: [false],
      metaTitle: [''],
      metaDescription: ['', [Validators.maxLength(160)]]
    });

    // Auto-generate slug from name
    this.addProductForm.get('name')?.valueChanges.subscribe(name => {
      if (name && this.addProductForm.get('slug')?.pristine) {
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        this.addProductForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Auto-generate meta title from name if empty
    this.addProductForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.addProductForm.get('metaTitle')?.value) {
        this.addProductForm.patchValue({ metaTitle: name }, { emitEvent: false });
      }
    });

    // Auto-generate SKU if empty
    this.addProductForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.addProductForm.get('sku')?.value) {
        const sku = `SKU-${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        this.addProductForm.patchValue({ sku }, { emitEvent: false });
      }
    });
  }

  private loadDummyData(): void {
    this.products = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        sku: 'SKU-IPH15P-2024',
        slug: 'iphone-15-pro',
        description: 'Latest Apple iPhone with advanced camera system and A17 Pro chip',
        category: 'Smartphones',
        categoryId: 1,
        price: 999,
        discountPrice: 899,
        stock: 45,
        status: 'active',
        featured: true,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'],
        metaTitle: 'iPhone 15 Pro - Buy Now',
        metaDescription: 'Get the latest iPhone 15 Pro with amazing features and camera',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'MacBook Pro 16"',
        sku: 'SKU-MBP16-2024',
        slug: 'macbook-pro-16',
        description: 'Powerful laptop with M3 Max chip for professionals',
        category: 'Laptops',
        categoryId: 2,
        price: 2499,
        discountPrice: 2299,
        stock: 22,
        status: 'active',
        featured: true,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h-400&fit=crop'],
        metaTitle: 'MacBook Pro 16" - Professional Laptop',
        metaDescription: 'Powerful MacBook Pro with M3 chip for maximum performance',
        createdAt: new Date('2024-01-10')
      },
      {
        id: 3,
        name: 'Sony WH-1000XM5',
        sku: 'SKU-SONYWH-1000',
        slug: 'sony-wh-1000xm5',
        description: 'Noise cancelling wireless headphones with premium sound',
        category: 'Audio',
        categoryId: 3,
        price: 399,
        discountPrice: 349,
        stock: 78,
        status: 'active',
        featured: false,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
        metaTitle: 'Sony WH-1000XM5 Headphones',
        metaDescription: 'Premium noise cancelling headphones with exceptional sound quality',
        createdAt: new Date('2024-01-05')
      },
      {
        id: 4,
        name: 'Nike Air Max 270',
        sku: 'SKU-NIKE270-2024',
        slug: 'nike-air-max-270',
        description: 'Comfortable sneakers with Max Air cushioning',
        category: 'Footwear',
        categoryId: 4,
        price: 150,
        discountPrice: 120,
        stock: 120,
        status: 'active',
        featured: false,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
        metaTitle: 'Nike Air Max 270 - Running Shoes',
        metaDescription: 'Comfortable running shoes with air cushioning technology',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 5,
        name: 'Samsung 4K Smart TV',
        sku: 'SKU-SAMSUNGTV-65',
        slug: 'samsung-4k-smart-tv',
        description: '65" 4K UHD Smart TV with Quantum Processor',
        category: 'Televisions',
        categoryId: 5,
        price: 799,
        discountPrice: 699,
        stock: 15,
        status: 'inactive',
        featured: false,
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'],
        metaTitle: 'Samsung 65" 4K Smart TV',
        metaDescription: 'Ultra HD Smart TV with brilliant colors and smart features',
        createdAt: new Date('2024-01-12')
      },
      {
        id: 6,
        name: 'Dyson V15 Detect',
        sku: 'SKU-DYSONV15-2024',
        slug: 'dyson-v15-detect',
        description: 'Cordless vacuum with laser dust detection',
        category: 'Home Appliances',
        categoryId: 6,
        price: 699,
        discountPrice: 649,
        stock: 32,
        status: 'active',
        featured: true,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
        metaTitle: 'Dyson V15 Detect Cordless Vacuum',
        metaDescription: 'Powerful cordless vacuum with advanced cleaning technology',
        createdAt: new Date('2024-01-18')
      }
    ];
  }

  private loadCategories(): void {
    this.categories = [
      { id: 1, name: 'Smartphones' },
      { id: 2, name: 'Laptops' },
      { id: 3, name: 'Audio' },
      { id: 4, name: 'Footwear' },
      { id: 5, name: 'Televisions' },
      { id: 6, name: 'Home Appliances' },
      { id: 7, name: 'Clothing' },
      { id: 8, name: 'Accessories' }
    ];
  }

  // Toast Methods
  showToast(message: string, type: Toast['type'] = 'info'): void {
    const id = ++this.toastId;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  getToastIcon(type: string): string {
    switch(type) {
      case 'success': return 'pi pi-check-circle';
      case 'error': return 'pi pi-times-circle';
      case 'warning': return 'pi pi-exclamation-triangle';
      default: return 'pi pi-info-circle';
    }
  }

  // Product CRUD Operations
  openAddProductModal(): void {
    this.addProductForm.reset({
      name: '',
      sku: '',
      slug: '',
      description: '',
      categoryId: null,
      price: 0,
      discountPrice: 0,
      stock: 0,
      status: true,
      featured: false,
      metaTitle: '',
      metaDescription: ''
    });
    this.imagePreviewUrls = [];
    this.addProductModalVisible = true;
  }

  closeAddProductModal(): void {
    this.addProductModalVisible = false;
  }

  openEditProductModal(product: Product): void {
    // If Edit is triggered from the View modal, close View first so Edit becomes active/visible.
    this.viewProductModalVisible = false;

    this.selectedProduct = product;
    this.editProductForm.patchValue({
      id: product.id,
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      status: product.status === 'active',
      featured: product.featured,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription
    });
    this.imagePreviewUrls = [...product.images];
    this.editProductModalVisible = true;
  }

  closeEditProductModal(): void {
    this.editProductModalVisible = false;
    this.selectedProduct = null;
  }

  openViewProductModal(product: Product): void {
    this.selectedProduct = product;
    this.viewProductModalVisible = true;
  }

  closeViewProductModal(): void {
    this.viewProductModalVisible = false;
    this.selectedProduct = null;
  }

  openDeleteConfirmation(product: Product): void {
    this.productToDelete = product;
    this.deleteConfirmationVisible = true;
  }

  cancelDelete(): void {
    this.deleteConfirmationVisible = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      const index = this.products.findIndex(p => p.id === this.productToDelete!.id);
      if (index > -1) {
        this.products.splice(index, 1);
        this.showToast(`Product "${this.productToDelete.name}" deleted successfully`, 'success');
        this.filterTable();
      }
    }
    this.cancelDelete();
  }

  // Image Upload Methods
  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
          this.isUploading = false;
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  }

  onEditImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
          this.isUploading = false;
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
  }

  // File input trigger methods
  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  triggerEditFileInput(): void {
    if (this.editFileInput) {
      this.editFileInput.nativeElement.click();
    }
  }

  saveProduct(): void {
    if (this.addProductForm.invalid) {
      this.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formValue = this.addProductForm.value;
    const newProduct: Product = {
      id: Math.max(...this.products.map(p => p.id), 0) + 1,
      name: formValue.name,
      sku: formValue.sku,
      slug: formValue.slug,
      description: formValue.description,
      category: this.categories.find(c => c.id === formValue.categoryId)?.name || '',
      categoryId: formValue.categoryId,
      price: formValue.price,
      discountPrice: formValue.discountPrice,
      stock: formValue.stock,
      status: formValue.status ? 'active' : 'inactive',
      featured: formValue.featured,
      images: this.imagePreviewUrls.length > 0 ? this.imagePreviewUrls : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
      metaTitle: formValue.metaTitle,
      metaDescription: formValue.metaDescription,
      createdAt: new Date()
    };

    this.products.unshift(newProduct);
    this.showToast('Product added successfully', 'success');
    this.closeAddProductModal();
    this.filterTable();
  }

  updateProduct(): void {
    if (this.editProductForm.invalid) {
      this.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formValue = this.editProductForm.value;
    const index = this.products.findIndex(p => p.id === formValue.id);
    
    if (index > -1) {
      this.products[index] = {
        ...this.products[index],
        name: formValue.name,
        sku: formValue.sku,
        slug: formValue.slug,
        description: formValue.description,
        category: this.categories.find(c => c.id === formValue.categoryId)?.name || '',
        categoryId: formValue.categoryId,
        price: formValue.price,
        discountPrice: formValue.discountPrice,
        stock: formValue.stock,
        status: formValue.status ? 'active' : 'inactive',
        featured: formValue.featured,
        images: this.imagePreviewUrls.length > 0 ? this.imagePreviewUrls : this.products[index].images,
        metaTitle: formValue.metaTitle,
        metaDescription: formValue.metaDescription
      };

      this.showToast('Product updated successfully', 'success');
      this.closeEditProductModal();
      this.filterTable();
    }
  }

  // Helper Methods
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Active' : 'Inactive';
  }

  getDiscountPercentage(price: number, discountPrice: number): string {
    if (discountPrice && price > 0) {
      const discount = ((price - discountPrice) / price) * 100;
      return `${discount.toFixed(0)}% OFF`;
    }
    return '';
  }

  // Pagination Methods
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }

  getPageNumbers(): number[] {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }

  // Table Operations
  filterTable(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(product => product.status === this.selectedStatusFilter);
    }

    // Apply category filter
    if (this.selectedCategoryFilter) {
      filtered = filtered.filter(product => product.categoryId === this.selectedCategoryFilter);
    }

    this.filteredProducts = filtered;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatusFilter = null;
    this.selectedCategoryFilter = null;
    this.filterTable();
  }

  // Format price
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}