import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Interface pour la réponse paginée de l'API
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

@Component({
  template: ''
})
export abstract class BaseCrudComponent<T> implements OnInit {
  items: T[] = [];
  showSearchForm = false;
  currentPage = 0; // Indexation 0-based pour l'API
  itemsPerPage = 10;
  totalPages = 1; // Fourni par l'API
  totalItems = 0; // Fourni par l'API (totalElements)
  pageNumbers: number[] = [];
  showConfirmation = false;
  showError = false;
  confirmationMessage = '';
  errorMessage = '';
  sortConfig: { column: keyof T, order: 'asc' | 'desc' } = { column: 'id' as keyof T, order: 'asc' };
  isSelectionMode = false;
  selectedIds: { [key: string]: boolean } = {};
  selectAll = false;
  searchSubject = new Subject<void>();
  isLoading = true;

  public newItem: Partial<T> = {};
  public selectedItem: T | any;
  public searchCriteria: Partial<T> = {};

  protected constructor(public modalService: NgbModal, protected toastr: ToastrService) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applySearch();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  abstract loadData(): void;
  // abstract addItem(): void;
  abstract initializeNewItem(): Partial<T>;
  abstract resetSearchCriteria(): Partial<T>;

  get selectedCount(): number {
    return Object.keys(this.selectedIds).length;
  }

  applySearchDebounced() {
    this.searchSubject.next();
  }

  sortByColumn(column: keyof T) {
    if (this.sortConfig.column === column) {
      this.sortConfig.order = this.sortConfig.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.column = column;
      this.sortConfig.order = 'asc';
    }
    this.currentPage = 0; // Réinitialiser à la première page
    this.loadData(); // Recharger les données pour appliquer le tri
  }

  protected applyFilters(items: T[]): T[] {
    return items; // Override dans les classes enfants pour le filtrage spécifique
  }

  get filteredItems() {
    return this.items;
  }

  get getTotalItems() {
    return this.totalItems; // Utiliser totalElements de l'API
  }

  get getTotalPages() {
    return this.totalPages; // Utiliser totalPages de l'API
  }

  get getPageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Pages 1-based pour l'UI
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1; // Converti en 0-based pour l'API
      this.loadData();
      this.showConfirmation = false;
    }
  }

  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    if (!this.showSearchForm) {
      this.searchCriteria = this.resetSearchCriteria();
    }
  }

  applySearch() {

  }

  toggleSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    this.selectedIds = {};
    this.selectAll = false;
  }

  toggleSelectAll() {
    this.selectedIds = {};
    if (!this.selectAll) {
      return;
    }
    this.filteredItems.forEach(item => {
      this.selectedIds[(item as any).id] = true;
    });
  }

  updateSelect(itemId?: string) {
    if (itemId && !this.selectedIds[itemId]) {
      delete this.selectedIds[itemId];
    }
    this.selectAll = this.filteredItems.length > 0 &&
        this.filteredItems.every(item => this.selectedIds[(item as any).id]);
  }

  openAddModal(content: any) {
    this.newItem = this.initializeNewItem();
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  openDeleteModal(content: any) {
    if (Object.keys(this.selectedIds).length === 0) return;
    const options: NgbModalOptions = { centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  protected showSuccessMessage(message: string) {
    this.toastr.success(message, '');
  }

  protected showErrorMessage(message: string) {
    this.toastr.error(message, '');
  }

  closeToast() {
    this.showConfirmation = false;
    this.showError = false;
    this.confirmationMessage = '';
    this.errorMessage = '';
  }

  protected isDateColumn(column: keyof T): boolean {
    return false; // Override dans les classes enfants pour les colonnes de type date
  }

  protected formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }
}