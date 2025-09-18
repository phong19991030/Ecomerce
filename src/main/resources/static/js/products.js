// src/main/resources/static/js/products.js
let currentPage = 0;
let currentPageSize = 12;
let currentSort = 'name,asc';
let currentKeyword = '';

// Load products khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Enter key để search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
});

function searchProducts() {
    currentKeyword = document.getElementById('searchInput').value;
    currentPage = 0; // Reset về trang đầu khi search
    loadProducts();
}

function loadProducts(page = currentPage) {
    currentPage = page;
    currentPageSize = parseInt(document.getElementById('pageSizeSelect').value);
    currentSort = document.getElementById('sortSelect').value;

    const [sortBy, sortDirection] = currentSort.split(',');

    const requestData = {
        page: currentPage,
        size: currentPageSize,
        sortBy: sortBy,
        sortDirection: sortDirection,
        keyword: currentKeyword
    };

    // Hiển thị loading
    document.getElementById('productsContainer').innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading products...</p>
        </div>
    `;

    // Gọi API
    fetch('/api/products/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data);
            updatePagination(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('productsContainer').innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4>Error loading products</h4>
                <p>Please try again later.</p>
                <button class="btn btn-primary" onclick="loadProducts()">
                    <i class="fas fa-redo me-2"></i>Retry
                </button>
            </div>
        `;
        });
}

function displayProducts(data) {
    const container = document.getElementById('productsContainer');

    if (data.content.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }

    let html = '';

    data.content.forEach((product, index) => {
        html += `
            <div class="col-md-4 col-lg-3 mb-4 product-card" style="animation-delay: ${index * 0.1}s">
                <div class="card h-100">
                    <img src="${product.imageUrl || '/images/placeholder-product.png'}" 
                         class="card-img-top product-image" 
                         alt="${product.name}"
                         onerror="this.src='/images/placeholder-product.png'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description ? product.description.substring(0, 60) + '...' : 'No description'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function updatePagination(data) {
    const pagination = document.getElementById('pagination');
    let html = '';

    if (data.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    // Previous button
    html += `
        <li class="page-item ${data.first ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="loadProducts(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;

    // Page numbers
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(data.totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadProducts(${i})">
                    ${i + 1}
                </a>
            </li>
        `;
    }

    // Next button
    html += `
        <li class="page-item ${data.last ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="loadProducts(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = html;
}

function addToCart(productId) {
    // TODO: Implement add to cart functionality
    console.log('Adding product to cart:', productId);
    // Hiển thị thông báo
    showToast('Product added to cart!', 'success');
}

function showToast(message, type = 'info') {
    // Tạo toast notification đơn giản
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
}