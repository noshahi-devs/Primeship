import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  // Modal states
  addCategoryModalVisible = false;
  editCategoryModalVisible = false;
  deleteConfirmationVisible = false;
  categoryToDelete: Category | null = null;

  // Data
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  paginatedCategories: Category[] = [];
  parentCategories: { label: string; value: number | null }[] = [];

  // Forms
  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;

  // Table settings
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  searchTerm = '';
  selectedStatusFilter: string | null = null;

  // Toast
  toasts: Toast[] = [];
  private toastId = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.loadDummyData();
    this.updateParentCategories();
    this.filterTable();
  }

  private initForms(): void {
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      parentId: [null],
      status: [true]
    });

    this.editCategoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      parentId: [null],
      status: [true]
    });

    // Auto-generate slug from name
    this.addCategoryForm.get('name')?.valueChanges.subscribe(name => {
      if (name && this.addCategoryForm.get('slug')?.pristine) {
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        this.addCategoryForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  private loadDummyData(): void {
    this.categories = [
      { id: 1, name: 'Electronics', slug: 'electronics', parentId: null, status: 'active' },
      { id: 2, name: 'Clothing', slug: 'clothing', parentId: null, status: 'active' },
      { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', parentId: null, status: 'active' },
      { id: 4, name: 'Smartphones', slug: 'smartphones', parentId: 1, status: 'active' },
      { id: 5, name: 'Laptops', slug: 'laptops', parentId: 1, status: 'active' },
      { id: 6, name: 'Men\'s Clothing', slug: 'mens-clothing', parentId: 2, status: 'active' },
      { id: 7, name: 'Women\'s Clothing', slug: 'womens-clothing', parentId: 2, status: 'active' },
      { id: 8, name: 'Kitchen Appliances', slug: 'kitchen-appliances', parentId: 3, status: 'inactive' },
      { id: 9, name: 'Gaming Laptops', slug: 'gaming-laptops', parentId: 5, status: 'active' },
      { id: 10, name: 'Business Laptops', slug: 'business-laptops', parentId: 5, status: 'active' }
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

  // Category CRUD Operations
  openAddCategoryModal(): void {
    this.addCategoryForm.reset({ name: '', slug: '', parentId: null, status: true });
    this.addCategoryModalVisible = true;
  }

  closeAddCategoryModal(): void {
    this.addCategoryModalVisible = false;
  }

  openEditCategoryModal(category: Category): void {
    this.editCategoryForm.patchValue({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      status: category.status === 'active'
    });
    this.editCategoryModalVisible = true;
  }

  closeEditCategoryModal(): void {
    this.editCategoryModalVisible = false;
  }

  openDeleteConfirmation(category: Category): void {
    this.categoryToDelete = category;
    this.deleteConfirmationVisible = true;
  }

  cancelDelete(): void {
    this.deleteConfirmationVisible = false;
    this.categoryToDelete = null;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      const index = this.categories.findIndex(c => c.id === this.categoryToDelete!.id);
      if (index > -1) {
        this.categories.splice(index, 1);
        this.showToast(`Category "${this.categoryToDelete.name}" deleted successfully`, 'success');
        this.filterTable();
      }
    }
    this.cancelDelete();
  }

  saveCategory(): void {
    if (this.addCategoryForm.invalid) {
      this.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formValue = this.addCategoryForm.value;
    const newCategory: Category = {
      id: Math.max(...this.categories.map(c => c.id), 0) + 1,
      name: formValue.name,
      slug: formValue.slug,
      parentId: formValue.parentId,
      status: formValue.status ? 'active' : 'inactive'
    };

    this.categories.unshift(newCategory);
    this.showToast('Category added successfully', 'success');
    this.closeAddCategoryModal();
    this.filterTable();
    this.updateParentCategories();
  }

  updateCategory(): void {
    if (this.editCategoryForm.invalid) {
      this.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formValue = this.editCategoryForm.value;
    const index = this.categories.findIndex(c => c.id === formValue.id);
    
    if (index > -1) {
      this.categories[index] = {
        ...this.categories[index],
        name: formValue.name,
        slug: formValue.slug,
        parentId: formValue.parentId,
        status: formValue.status ? 'active' : 'inactive'
      };

      this.showToast('Category updated successfully', 'success');
      this.closeEditCategoryModal();
      this.filterTable();
      this.updateParentCategories();
    }
  }

  // Helper Methods
  private updateParentCategories(): void {
    this.parentCategories = [
      { label: 'No Parent', value: null },
      ...this.categories
        .filter(cat => cat.status === 'active')
        .map(cat => ({ label: cat.name, value: cat.id }))
    ];
  }

  getParentName(parentId: number | null): string {
    if (!parentId) return '-';
    const parent = this.categories.find(c => c.id === parentId);
    return parent ? parent.name : '-';
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Active' : 'Inactive';
  }

  // Table Operations
  filterTable(): void {
    let filtered = [...this.categories];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchLower) ||
        category.slug.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(category => category.status === this.selectedStatusFilter);
    }

    this.filteredCategories = filtered;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
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
    this.filterTable();
  }
}