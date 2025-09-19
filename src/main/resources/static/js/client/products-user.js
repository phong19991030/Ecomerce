// src/main/resources/static/js/products-user.js
class UserProductManager {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 12;
        this.sortBy = 'name';
        this.sortDirection = 'asc';
        this.currentSearchParams = {};
        this.isGridView = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.loadBrands();
        this.loadCategories();
    }

    setupEventListeners() {
        // Search functionality
        $('#searchButton').on('click', () => this.handleSearch());
        $('#searchInput').on('keypress', (e) => {
            if (e.which === 13) this.handleSearch();
        });

        // Filter functionality
        $('#applyFilters').on('click', () => this.applyFilters());
        $('#clearFilters').on('click', () => this.clearFilters());

        // Sort functionality
        $('#sortBy').on('change', (e) => {
            const sortValue = $(e.target).val();
            if (sortValue.includes(',')) {
                const parts = sortValue.split(',');
                this.sortBy = parts[0];
                this.sortDirection = parts[1] || 'asc';
            } else {
                this.sortBy = sortValue;
                this.sortDirection = 'asc';
            }
            this.loadProducts();
        });

        // View toggle
        $('#gridView').on('click', () => this.setGridView(true));
        $('#listView').on('click', () => this.setGridView(false));

        // Reset search
        $('#resetSearch').on('click', () => this.clearSearch());

        // Quick view
        $(document).on('click', '.quick-view-btn', (e) => {
            const productId = $(e.currentTarget).data('id');
            this.showQuickView(productId);
        });
    }

    async loadProducts() {
        try {
            this.showLoading();

            const params = {
                page: this.currentPage,
                size: this.pageSize,
                sortBy: this.sortBy,
                sortDirection: this.sortDirection,
                active: true, // Only show active products for users
                ...this.currentSearchParams
            };

            // Remove empty parameters
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            const response = await fetch(`/api/public/products?${new URLSearchParams(params)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.renderProducts(data);
            this.renderPagination(data);
            this.updateProductCount(data);

        } catch (error) {
            console.error('Error loading products:', error);
            ToastService.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            this.renderEmptyState();
        } finally {
            this.hideLoading();
        }
    }

    async loadBrands() {
        try {
            const response = await fetch('/api/products/brands');
            if (response.ok) {
                const brands = await response.json();
                this.renderBrandFilters(brands);
            }
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/admin/api/categories/active');
            if (response.ok) {
                const categories = await response.json();
                this.renderCategoryFilters(categories);
                this.renderFooterCategories(categories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    handleSearch() {
        const keyword = $('#searchInput').val().trim();
        if (keyword) {
            this.currentSearchParams = { keyword };
            this.currentPage = 0;
            this.loadProducts();
        }
    }

    applyFilters() {
        const filters = {};

        // Price filters
        const minPrice = $('#minPrice').val();
        const maxPrice = $('#maxPrice').val();
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;

        // Brand filters
        const selectedBrands = [];
        $('.brand-filter:checked').each(function() {
            selectedBrands.push($(this).val());
        });
        if (selectedBrands.length > 0) {
            filters.brand = selectedBrands.join(',');
        }

        // Stock filter
        if ($('#inStockOnly').is(':checked')) {
            filters.minStock = 1;
        }

        this.currentSearchParams = filters;
        this.currentPage = 0;
        this.loadProducts();
    }

    clearFilters() {
        $('#minPrice').val('');
        $('#maxPrice').val('');
        $('.brand-filter').prop('checked', false);
        $('#inStockOnly').prop('checked', true);
        this.currentSearchParams = {};
        this.currentPage = 0;
        this.loadProducts();
    }

    clearSearch() {
        $('#searchInput').val('');
        this.currentSearchParams = {};
        this.currentPage = 0;
        this.loadProducts();
        $('#noProducts').addClass('d-none');
    }

    setGridView(isGrid) {
        this.isGridView = isGrid;
        if (isGrid) {
            $('#gridView').addClass('active');
            $('#listView').removeClass('active');
            $('#productsContainer').removeClass('list-view').addClass('row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4');
        } else {
            $('#gridView').removeClass('active');
            $('#listView').addClass('active');
            $('#productsContainer').removeClass('row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4').addClass('list-view');
        }
    }

    async showQuickView(productId) {
        try {
            const response = await fetch(`/api/public/products/${productId}`);
            if (response.ok) {
                const product = await response.json();
                this.renderQuickView(product);

                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
                modal.show();
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            ToastService.error('Không thể tải thông tin sản phẩm.');
        }
    }

    renderProducts(data) {
        const container = $('#productsContainer');
        container.empty();

        if (!data || !data.content || data.content.length === 0) {
            this.renderEmptyState();
            return;
        }

        data.content.forEach(product => {
            container.append(this.getProductCardTemplate(product));
        });
    }

    renderPagination(data) {
        const pagination = $('#pagination');
        pagination.empty();

        if (!data || data.totalPages <= 1) {
            return;
        }

        // Previous button
        const prevLi = $(`
            <li class="page-item ${data.first ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.number - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `);
        pagination.append(prevLi);

        // Page numbers
        for (let i = 0; i < data.totalPages; i++) {
            const pageLi = $(`
                <li class="page-item ${i === data.number ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                </li>
            `);
            pagination.append(pageLi);
        }

        // Next button
        const nextLi = $(`
            <li class="page-item ${data.last ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.number + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `);
        pagination.append(nextLi);

        // Add click event to pagination links
        $('.page-link').on('click', (e) => {
            e.preventDefault();
            const page = $(e.currentTarget).data('page');
            if (page !== undefined) {
                this.currentPage = page;
                this.loadProducts();
                window.scrollTo(0, 0);
            }
        });
    }

    renderBrandFilters(brands) {
        const container = $('#brandFilters');
        container.empty();

        brands.forEach(brand => {
            if (brand) {
                const checkbox = $(`
                    <div class="form-check">
                        <input class="form-check-input brand-filter" type="checkbox" value="${brand}" id="brand-${brand}">
                        <label class="form-check-label" for="brand-${brand}">
                            ${brand}
                        </label>
                    </div>
                `);
                container.append(checkbox);
            }
        });
    }

    renderCategoryFilters(categories) {
        const container = $('#categoryList');
        container.empty();

        categories.forEach(category => {
            const item = $(`
                <div class="form-check">
                    <input class="form-check-input category-filter" type="checkbox" value="${category.id}" id="category-${category.id}">
                    <label class="form-check-label" for="category-${category.id}">
                        ${category.name}
                    </label>
                </div>
            `);
            container.append(item);
        });

        // Add event listener to category filters
        $('.category-filter').on('change', (e) => {
            const selectedCategories = [];
            $('.category-filter:checked').each(function() {
                selectedCategories.push($(this).val());
            });

            if (selectedCategories.length > 0) {
                this.currentSearchParams.categoryId = selectedCategories.join(',');
            } else {
                delete this.currentSearchParams.categoryId;
            }

            this.currentPage = 0;
            this.loadProducts();
        });
    }

    renderFooterCategories(categories) {
        const container = $('#footerCategories');
        container.empty();

        categories.slice(0, 5).forEach(category => {
            const item = $(`<li><a href="/products?category=${category.id}" class="text-white">${category.name}</a></li>`);
            container.append(item);
        });
    }

    renderQuickView(product) {
        $('#quickViewTitle').text(product.name);
        $('#quickViewName').text(product.name);
        $('#quickViewPrice').text(this.formatCurrency(product.price) + ' VND');
        $('#quickViewSku').text(product.sku ? ` (SKU: ${product.sku})` : '');
        $('#quickViewDescription').text(product.description || 'Không có mô tả');
        $('#quickViewBrand').text(product.brand || 'Không xác định');

        const imageUrl = product.imageUrl || '/images/placeholder-product.png';
        $('#quickViewImage').attr('src', imageUrl).attr('alt', product.name);

        const stockStatus = product.stock > 0 ?
            `<span class="badge bg-success">Còn hàng (${product.stock})</span>` :
            `<span class="badge bg-danger">Hết hàng</span>`;
        $('#quickViewStock').html(stockStatus);

        $('#quickViewDetailBtn').attr('href', `/products/${product.id}`);
    }

    renderEmptyState() {
        $('#productsContainer').empty();
        $('#pagination').empty();
        $('#noProducts').removeClass('d-none');
    }

    updateProductCount(data) {
        const totalElements = data.totalElements || 0;
        const firstElement = (this.currentPage * this.pageSize) + 1;
        const lastElement = Math.min((this.currentPage + 1) * this.pageSize, totalElements);

        $('#productCount').text(`Hiển thị ${firstElement}-${lastElement} của ${totalElements} sản phẩm`);
        $('#noProducts').addClass('d-none');
    }

    getProductCardTemplate(product) {
        const imageUrl = product.imageUrl || '/images/placeholder-product.png';
        const truncatedDescription = product.description ?
            (product.description.length > 100 ?
                product.description.substring(0, 100) + '...' :
                product.description) :
            'Không có mô tả';

        const stockBadge = product.stock > 0 ?
            `<span class="badge bg-success">Còn hàng</span>` :
            `<span class="badge bg-danger">Hết hàng</span>`;

        if (this.isGridView) {
            return `
                <div class="col">
                    <div class="card h-100 product-card">
                        <div class="position-relative">
                            <img src="${imageUrl}" class="card-img-top" alt="${product.name}" 
                                 onerror="this.src='/images/placeholder-product.png'">
                            <div class="card-img-overlay d-flex justify-content-end align-items-start">
                                ${stockBadge}
                            </div>
                            <div class="position-absolute top-0 end-0 m-2">
                                <button class="btn btn-sm btn-light quick-view-btn" data-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted small">${truncatedDescription}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary mb-0">${this.formatCurrency(product.price)} VND</span>
                                <button class="btn btn-primary btn-sm" ${product.stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-shopping-cart me-1"></i>Thêm
                                </button>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <small class="text-muted">
                                <i class="fas fa-tag me-1"></i>${product.category?.name || 'Không có danh mục'}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="col-12 mb-4">
                    <div class="card product-list-card">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img src="${imageUrl}" class="img-fluid rounded-start h-100 object-fit-cover" 
                                     alt="${product.name}" onerror="this.src='/images/placeholder-product.png'">
                            </div>
                            <div class="col-md-7">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">${truncatedDescription}</p>
                                    <div class="mb-2">
                                        <span class="text-primary fw-bold">${this.formatCurrency(product.price)} VND</span>
                                    </div>
                                    <div class="d-flex gap-2 mb-2">
                                        ${stockBadge}
                                        <span class="badge bg-secondary">${product.brand || 'No brand'}</span>
                                    </div>
                                    <small class="text-muted">
                                        <i class="fas fa-tag me-1"></i>${product.category?.name || 'No category'}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-2 d-flex flex-column justify-content-center align-items-center p-3">
                                <button class="btn btn-primary mb-2 w-100" ${product.stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-shopping-cart me-1"></i>Thêm
                                </button>
                                <button class="btn btn-outline-primary quick-view-btn w-100" data-id="${product.id}">
                                    <i class="fas fa-eye me-1"></i>Xem nhanh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    formatCurrency(amount) {
        if (!amount) return '0';
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    showLoading() {
        $('#loadingSpinner').show();
        $('#productsContainer').hide();
        $('#pagination').hide();
    }

    hideLoading() {
        $('#loadingSpinner').hide();
        $('#productsContainer').show();
        $('#pagination').show();
    }
}

// CSS for list view
$(document).ready(function() {
    // Add custom CSS for list view
    $('head').append(`
        <style>
            .product-list-card {
                transition: transform 0.2s;
            }
            .product-list-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .product-card {
                transition: transform 0.2s;
            }
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            }
            .object-fit-cover {
                object-fit: cover;
            }
        </style>
    `);

    // Initialize product manager
    window.userProductManager = new UserProductManager();
});