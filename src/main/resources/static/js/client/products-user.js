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

        // Filter functionality - XÓA nút Áp dụng vì sẽ auto filter
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

        // Auto filter khi thay đổi
        $(document).on('change', '.brand-filter, .category-filter, #inStockOnly', () => {
            this.applyFilters();
        });

        // Auto filter khi thay đổi giá
        $('#minPrice, #maxPrice').on('input', _.debounce(() => {
            this.applyFilters();
        }, 500));

        $('#quickViewAddToCart').on('click', function (e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            if (productId) {
                addToCart(productId, 1);
                $('#quickViewModal').modal('hide');
            }
        });

        $(document).on('click', '.add-to-cart-btn', async function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!$(this).prop('disabled')) {
                const productId = $(this).data('product-id');
                await addToCart(productId, 1);
            }
        });
    }

    loadProducts() {
        try {
            this.showLoading();

            const params = {
                page: this.currentPage,
                size: this.pageSize,
                sortBy: this.sortBy,
                sortDirection: this.sortDirection,
                active: true,
                ...this.currentSearchParams
            };

            // if (params.categoryId) {
            //     params.category = params.categoryId;
            //     delete params.categoryId;
            // }

            // Remove empty parameters
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            // SỬA THÀNH AJAX
            $.ajax({
                url: '/api/public/products',
                type: 'GET',
                data: params,
                success: (data) => {
                    this.renderProducts(data);
                    this.renderPagination(data);
                    this.updateProductCount(data);
                },
                error: (xhr, status, error) => {
                    console.error('Error loading products:', error);
                    ToastService.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
                    this.renderEmptyState();
                },
                complete: () => {
                    this.hideLoading();
                }
            });

        } catch (error) {
            console.error('Error in load process:', error);
            ToastService.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            this.renderEmptyState();
            this.hideLoading();
        }
    }

    loadBrands() {
        try {
            // SỬA THÀNH AJAX
            $.ajax({
                url: '/api/public/products/brands',
                type: 'GET',
                success: (brands) => {
                    this.renderBrandFilters(brands);
                },
                error: (xhr, status, error) => {
                    console.error('Error loading brands:', error);
                }
            });
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    }

    loadCategories() {
        try {
            // SỬA THÀNH AJAX
            $.ajax({
                url: '/api/public/categories/find_all',
                type: 'GET',
                success: (categories) => {
                    this.renderCategoryFilters(categories);
                    this.renderFooterCategories(categories);
                },
                error: (xhr, status, error) => {
                    console.error('Error loading categories:', error);
                    this.renderCategoryFilters([]);
                    this.renderFooterCategories([]);
                }
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            this.renderCategoryFilters([]);
            this.renderFooterCategories([]);
        }
    }

    renderCategoryFilters(categories) {
        const container = $('#categoryList');
        container.empty();

        if (categories.length === 0) {
            container.append('<p class="text-muted small">Không có danh mục nào</p>');
            return;
        }

        categories.forEach(category => {
            const item = $(`
                <div class="form-check mb-2">
                    <input class="form-check-input category-filter" type="checkbox" 
                           value="${category.id}" id="category-${category.id}">
                    <label class="form-check-label small" for="category-${category.id}">
                        ${category.name}
                    </label>
                </div>
            `);
            container.append(item);
        });
    }

    renderFooterCategories(categories) {
        const container = $('#footerCategories');
        container.empty();

        if (categories.length === 0) {
            container.append('<li class="text-muted small">Không có danh mục</li>');
            return;
        }

        categories.slice(0, 5).forEach(category => {
            const item = $(`
                <li class="mb-1">
                    <a href="/products?category=${category.id}" class="text-white small">
                        <i class="fas fa-arrow-right me-1 small"></i>${category.name}
                    </a>
                </li>
            `);
            container.append(item);
        });
    }

    handleSearch() {
        const keyword = $('#searchInput').val().trim();
        if (keyword) {
            this.currentSearchParams = {keyword};
        } else {
            delete this.currentSearchParams.keyword;
        }
        this.currentPage = 0;
        this.loadProducts();
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
        $('.brand-filter:checked').each(function () {
            selectedBrands.push($(this).val());
        });
        if (selectedBrands.length > 0) {
            filters.brand = selectedBrands.join(',');
        } else {
            delete filters.brand;
        }

        const selectedCategories = [];
        $('.category-filter:checked').each(function () {
            selectedCategories.push($(this).val());
        });
        if (selectedCategories.length > 0) {
            filters.category = selectedCategories.join(',');
        } else {
            delete filters.category;
        }

        // Stock filter
        if ($('#inStockOnly').is(':checked')) {
            filters.minStock = 1;
        } else {
            delete filters.minStock;
        }

        this.currentSearchParams = filters;
        this.currentPage = 0;
        this.loadProducts();
    }

    clearFilters() {
        $('#minPrice').val('');
        $('#maxPrice').val('');
        $('.brand-filter').prop('checked', false);
        $('.category-filter').prop('checked', false);
        $('#inStockOnly').prop('checked', true);
        this.currentSearchParams = {};
        this.currentPage = 0;
        this.loadProducts();
    }

    clearSearch() {
        $('#searchInput').val('');
        delete this.currentSearchParams.keyword;
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

    showQuickView(productId) {
        try {
            // SỬA THÀNH AJAX
            $.ajax({
                url: `/api/public/products/${productId}`,
                type: 'GET',
                success: (product) => {
                    this.renderQuickView(product);
                    // Show modal
                    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
                    modal.show();
                },
                error: (xhr, status, error) => {
                    console.error('Error loading product details:', error);
                    ToastService.error('Không thể tải thông tin sản phẩm.');
                }
            });
        } catch (error) {
            console.error('Error in quick view process:', error);
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

        $('#quickViewDetailBtn').attr('href', `/client/products/products/${product.id}`);

        // QUAN TRỌNG: Thiết lập product id và trạng thái cho nút thêm trong modal
        $('#quickViewAddToCart')
            .data('product-id', product.id)
            .prop('disabled', product.stock === 0);
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
                            <button class="btn btn-primary btn-sm add-to-cart-btn" 
                                    data-product-id="${product.id}" 
                                    ${product.stock === 0 ? 'disabled' : ''}>
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
                            <button class="btn btn-primary mb-2 w-100 add-to-cart-btn" 
                                    data-product-id="${product.id}"
                                    ${product.stock === 0 ? 'disabled' : ''}>
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

// Thêm debounce function nếu chưa có
if (typeof _ === 'undefined') {
    var _ = {
        debounce: function (func, wait) {
            let timeout;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }
    };
}

// Thêm vào giỏ hàng với async/await
async function addToCart(productId, quantity = 1) {
    try {
        // Kiểm tra đăng nhập đồng bộ
        const loggedIn = await isUserLoggedIn();

        if (!loggedIn) {
            ToastService.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            sessionStorage.setItem('pendingCartItem', JSON.stringify({
                productId: productId,
                quantity: quantity
            }));
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = '/login';
            return;
        }

        const requestData = {
            productId: productId,
            quantity: quantity
        };

        // Thêm CSRF token vào headers
        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && header) {
            headers[header] = token;
        }

        // Sử dụng fetch thay vì $.ajax để có error handling tốt hơn
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData),
            credentials: 'include' // Quan trọng: gửi cookie session
        });

        if (response.ok) {
            const result = await response.json();
            ToastService.success('Đã thêm sản phẩm vào giỏ hàng!');
            updateCartCount();
            return result;
        } else {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 401) {
                ToastService.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                window.location.href = '/login';
            } else if (response.status === 400) {
                ToastService.error('Dữ liệu không hợp lệ: ' + (errorData.error || 'Vui lòng thử lại'));
            } else {
                ToastService.error('Lỗi khi thêm vào giỏ hàng: ' + (errorData.error || 'Unknown error'));
            }
            throw new Error(errorData.error || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        if (!error.message.includes('Failed to add to cart')) {
            ToastService.error('Lỗi khi thêm vào giỏ hàng');
        }
    }
}

async function isUserLoggedIn() {
    try {
        const response = await fetch('/api/auth/status', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.authenticated === true;
        }
        return false;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

function isUserLoggedInSync() {
    // Tạo một XMLHttpRequest đồng bộ (không khuyến nghị cho production)
    let isLoggedIn = false;
    $.ajax({
        url: '/api/auth/status',
        type: 'GET',
        async: false, // Làm request đồng bộ
        success: function (data) {
            isLoggedIn = data.authenticated === true;
        },
        error: function () {
            isLoggedIn = false;
        }
    });
    return isLoggedIn;
}

// Function để cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    // Kiểm tra trước nếu user đã đăng nhập
    if (!isUserLoggedInSync()) {
        $('#cartCount').text('0');
        return;
    }

    $.ajax({
        url: '/api/cart/count',
        type: 'GET',
        beforeSend: function (xhr) {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");
            if (token && header) {
                xhr.setRequestHeader(header, token);
            }
        },
        success: function (count) {
            $('#cartCount').text(count);
        },
        error: function (xhr, status, error) {
            console.error('Error getting cart count:', xhr.responseText);
            $('#cartCount').text('0');

            if (xhr.status === 401) {
                // User không được xác thực, không hiển thị lỗi
            }
        }
    });
}

$(document).ready(function () {
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
            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .add-to-cart-btn:disabled {
                background-color: #6c757d;
                border-color: #6c757d;
            }
        </style>
    `);

    // Xử lý pending cart item sau khi login - SỬA LẠI
    const pendingCartItem = sessionStorage.getItem('pendingCartItem');
    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

    // SỬA: Chỉ xử lý nếu có cookie (đã đăng nhập)
    if (pendingCartItem && isUserLoggedInSync()) {
        try {
            const item = JSON.parse(pendingCartItem);
            // Thêm vào giỏ hàng sau 1 giây để đảm bảo page đã load xong
            setTimeout(() => {
                addToCart(item.productId, item.quantity);
            }, 1000);
        } catch (e) {
            console.error('Error processing pending cart item:', e);
        }

        // Xóa pending item
        sessionStorage.removeItem('pendingCartItem');
    }

    if (redirectAfterLogin) {
        sessionStorage.removeItem('redirectAfterLogin');
        // Optional: redirect về trang trước đó
        // window.location.href = redirectAfterLogin;
    }

    // Initialize product manager
    window.userProductManager = new UserProductManager();
    updateCartCount();
});
