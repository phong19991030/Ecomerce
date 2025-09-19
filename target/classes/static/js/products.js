// src/main/resources/static/js/products.js
class ProductManager {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 10;
        this.sortBy = 'name';
        this.sortDirection = 'asc';
        this.currentSearchParams = {};
        this.init();
    }

    init() {
        this.loadProducts(); // Luôn load từ API
        this.setupEventListeners();
        this.loadBrands();
        this.loadSearchParamsFromURL();
    }

    setupEventListeners() {
        // Search form
        $('#searchForm').on('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Clear search
        $('#clearSearch').on('click', () => {
            this.clearSearch();
        });

        // Pagination - sử dụng event delegation
        $(document).on('click', '.page-link', (e) => {
            e.preventDefault();
            const page = $(e.currentTarget).data('page');
            if (page !== undefined) {
                this.currentPage = page;
                this.loadProducts();
            }
        });

        $(document).on('click', '.delete-product', (e) => {
            e.preventDefault();
            const productId = $(e.currentTarget).data('id');
            this.deleteProduct(productId);
        });
    }

    loadSearchParamsFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParams = {};

        ['name', 'description', 'minPrice', 'maxPrice', 'brand', 'active'].forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                searchParams[param] = value;
                $(`#search${param.charAt(0).toUpperCase() + param.slice(1)}`).val(value);
            }
        });

        this.currentSearchParams = searchParams;
    }

    async loadProducts() {
        try {
            this.showLoading();

            const params = {
                page: this.currentPage,
                size: this.pageSize,
                sortBy: this.sortBy,
                sortDirection: this.sortDirection,
                ...this.currentSearchParams
            };

            // Remove empty parameters
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            // Sử dụng Ajax thay vì Fetch
            const self = this;
            $.ajax({
                url: '/api/products',
                type: 'GET',
                data: params,
                success: function (data) {
                    self.renderProducts(data);
                    self.renderPagination(data);
                },
                error: function (xhr, status, error) {
                    let errorMessage = 'Failed to load products';

                    if (xhr.status === 403) {
                        errorMessage = 'Permission denied: You are not authorized to view products';
                    } else if (xhr.responseJSON && xhr.responseJSON.error) {
                        errorMessage = xhr.responseJSON.error;
                    }

                    ToastService.error(errorMessage);
                    self.renderEmptyState();
                },
                complete: function () {
                    self.hideLoading();
                }
            });

        } catch (error) {
            console.error('Error in load process:', error);
            ToastService.error('Failed to load products: ' + error.message);
            this.renderEmptyState();
            this.hideLoading();
        }
    }

    async loadBrands() {
        try {
            // Sử dụng Ajax thay vì Fetch
            $.ajax({
                url: '/api/products/brands',
                type: 'GET',
                success: (brands) => {
                    this.renderBrandFilter(brands);
                },
                error: (xhr, status, error) => {
                    console.error('Failed to load brands:', error);
                }
            });
        } catch (error) {
            console.error('Failed to load brands:', error);
        }
    }

    getCsrfToken() {
        // Lấy CSRF token từ meta tag
        const token = $('meta[name="_csrf"]').attr('content');
        const header = $('meta[name="_csrf_header"]').attr('content');

        if (!token) {
            console.warn('CSRF token not found');
            return '';
        }
        return token;
    }

    handleSearch() {
        const formData = new FormData(document.getElementById('searchForm'));
        this.currentSearchParams = {};

        formData.forEach((value, key) => {
            if (value) this.currentSearchParams[key] = value;
        });

        this.currentPage = 0;
        this.loadProducts();

        // Update URL without reloading page
        this.updateURL();
    }

    updateURL() {
        const urlParams = new URLSearchParams();
        Object.entries(this.currentSearchParams).forEach(([key, value]) => {
            urlParams.set(key, value);
        });

        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, '', newURL);
    }

    clearSearch() {
        $('#searchForm')[0].reset();
        this.currentSearchParams = {};
        this.currentPage = 0;
        this.loadProducts();
        window.history.replaceState({}, '', window.location.pathname);
    }

    async deleteProduct(id) {
        // Hiển thị modal confirm
        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();

        return new Promise((resolve) => {
            $('#confirmDeleteBtn').off('click').on('click', async () => {
                try {
                    modal.hide();

                    $.ajax({
                        url: `/api/products/${id}`,
                        type: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': this.getCsrfToken()
                        },
                        success: (response) => {
                            ToastService.success('Product deleted successfully');
                            this.loadProducts();
                        },
                        error: (xhr, status, error) => {
                            let errorMessage = 'Failed to delete product';

                            if (xhr.status === 403) {
                                errorMessage = 'Permission denied: You are not authorized to delete products';
                            } else if (xhr.status === 401) {
                                errorMessage = 'Authentication required: Please login again';
                            } else if (xhr.responseJSON && xhr.responseJSON.error) {
                                errorMessage = xhr.responseJSON.error;
                            }

                            console.error('Error deleting product:', errorMessage);
                            ToastService.error(errorMessage);
                        },
                        complete: () => {
                            resolve();
                        }
                    });
                } catch (error) {
                    console.error('Error in delete process:', error);
                    ToastService.error('Failed to delete product: ' + error.message);
                    resolve();
                }
            });

            // Xử lý khi modal đóng mà không xóa
            $('#confirmDeleteModal').on('hidden.bs.modal', () => {
                resolve();
            });
        });
    }

    renderProducts(data) {
        const container = $('#productsContainer');
        if (!data || !data.content || data.content.length === 0) {
            container.html(this.getNoProductsTemplate());
            return;
        }

        let html = '';
        data.content.forEach(product => {
            html += this.getProductRowTemplate(product);
        });
        container.html(html);
    }

    renderPagination(data) {
        const pagination = $('#pagination');
        if (!data || data.totalPages <= 1) {
            pagination.empty();
            return;
        }

        let html = `
            <li class="page-item ${data.first ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.number - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Hiển thị tối đa 5 trang
        const startPage = Math.max(0, data.number - 2);
        const endPage = Math.min(data.totalPages - 1, data.number + 2);

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === data.number ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                </li>
            `;
        }

        html += `
            <li class="page-item ${data.last ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.number + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.html(html);
    }

    renderBrandFilter(brands) {
        const select = $('#searchBrand');
        let html = '<option value="">Tất cả </option>';
        brands.forEach(brand => {
            const selected = this.currentSearchParams.brand === brand ? 'selected' : '';
            html += `<option value="${brand}" ${selected}>${brand}</option>`;
        });
        select.html(html);
    }

    renderEmptyState() {
        $('#productsContainer').html(this.getNoProductsTemplate());
        $('#pagination').empty();
    }

    getProductRowTemplate(product) {
        const imageUrl = product.imageUrl || '/images/placeholder-product.png';
        const description = product.description ?
            (product.description.length > 50 ?
                product.description.substring(0, 50) + '...' :
                product.description) :
            'No description';

        return `
            <tr>
                <td>${product.id || 'N/A'}</td>
                <td>
                    <img src="${imageUrl}" 
                         alt="Product Image" class="img-thumbnail" 
                         style="width: 50px; height: 50px; object-fit: cover;"
                         onerror="this.src='/images/placeholder-product.png'">
                </td>
                <td>
                    <strong>${product.name || 'Unnamed Product'}</strong>
                    <br>
                    <small class="text-muted">${description}</small>
                </td>
                <td>
                    <span class="fw-bold text-success">
                       ${product.price ? formatCurrency(product.price) + 'VND' : 'Free'}
                    </span>
                </td>
                <td>
                    <span class="${product.stock > 10 ? 'text-success' : 'text-danger'}">
                        ${product.stock || 0} in stock
                    </span>
                </td>
                <td>${product.category?.name || 'No category'}</td>
                <td>
                    <span class="badge ${product.active ? 'bg-success' : 'bg-secondary'}">
                        ${product.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <a href="/admin/products/edit/${product.id}" class="btn btn-outline-primary">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn btn-outline-danger delete-product" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }


    getNoProductsTemplate() {
        return `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>No products found</h5>
                    <p class="text-muted">Try adjusting your search criteria or add a new product</p>
                    <a href="/admin/products/new" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>Add Product
                    </a>
                </td>
            </tr>
        `;
    }

    showLoading() {
        $('#loadingSpinner').removeClass('d-none');
        $('#productsContainer').hide();
        $('#paginationContainer').hide();
    }

    hideLoading() {
        $('#loadingSpinner').addClass('d-none');
        $('#productsContainer').show();
        $('#paginationContainer').show();
    }
}

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

$(document).ready(function () {
    window.productManager = new ProductManager();
});
