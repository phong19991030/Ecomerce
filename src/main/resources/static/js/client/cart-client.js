// cart-client.js
class CartClient {
    constructor() {
        this.cartData = null;
        this.init();
    }

    init() {
        this.loadCartData();
        this.setupEventListeners();
        this.initTooltips();
    }

    setupEventListeners() {
        // Event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            // Quantity minus button
            if (e.target.closest('.quantity-minus')) {
                const button = e.target.closest('.quantity-minus');
                const itemId = button.getAttribute('data-item-id');
                this.updateQuantity(itemId, -1, button);
            }

            // Quantity plus button
            if (e.target.closest('.quantity-plus')) {
                const button = e.target.closest('.quantity-plus');
                const itemId = button.getAttribute('data-item-id');
                this.updateQuantity(itemId, 1, button);
            }

            // Remove item button
            if (e.target.closest('.remove-item-btn')) {
                const button = e.target.closest('.remove-item-btn');
                const itemId = button.getAttribute('data-item-id');
                this.removeItem(itemId, button);
            }
        });

        // Input change events
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.updateQuantityInput(e.target);
            }
        });
    }

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Load cart data from API
    loadCartData() {
        this.showLoading();

        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        $.ajax({
            url: '/api/cart',
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                [header]: token
            },
            success: (data) => {
                // API trả về trực tiếp CartDTO, không có wrapper "success" và "cart"
                this.cartData = data;
                this.displayCartData();
            },
            error: (xhr, status, error) => {
                let errorMessage = 'Lỗi khi tải giỏ hàng';

                if (xhr.status === 401) {
                    errorMessage = 'Vui lòng đăng nhập để xem giỏ hàng';
                    setTimeout(() => {
                        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                    }, 2000);
                } else if (xhr.status === 404) {
                    errorMessage = 'Giỏ hàng không tồn tại';
                } else {
                    // Xử lý error response từ API
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        if (errorResponse.error) {
                            errorMessage = errorResponse.error;
                        }
                    } catch (e) {
                        // Nếu không parse được JSON, giữ nguyên errorMessage
                    }
                }

                this.showError(errorMessage);
                console.error('Error loading cart:', error);
            },
            complete: () => {
                this.hideLoading();
            }
        });
    }

    displayCartData() {
        // Kiểm tra nếu response là error object
        if (this.cartData && this.cartData.error) {
            this.showError(this.cartData.error);
            return;
        }

        if (!this.cartData || !this.cartData.items || this.cartData.items.length === 0) {
            this.showEmptyCart();
            return;
        }

        // Update username if available
        if (this.cartData.username) {
            document.getElementById('username').textContent = this.cartData.username;
        }

        // Render cart items
        this.renderCartItems();

        // Update summary
        this.updateCartSummary();

        // Show cart content
        document.getElementById('cartContent').classList.remove('d-none');
        document.getElementById('emptyCart').classList.add('d-none');
        document.getElementById('errorMessage').classList.add('d-none');
    }

    renderCartItems() {
        const cartItemsTable = document.getElementById('cartItemsTable');
        cartItemsTable.innerHTML = '';

        this.cartData.items.forEach(item => {
            const row = this.createCartItemRow(item);
            cartItemsTable.appendChild(row);
        });
    }

    createCartItemRow(item) {
        const row = document.createElement('tr');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.product.imageUrl || '/images/placeholder-product.png'}"
                         alt="${item.product.name}"
                         class="cart-item-image me-3"
                         style="width: 60px; height: 60px; object-fit: cover;"
                         onerror="this.src='/images/placeholder-product.png'">
                    <div>
                        <a href="/client/products/${item.product.id}" class="text-decoration-none">
                            <h6 class="mb-1 product-name">${item.product.name}</h6>
                        </a>
                        <small class="text-muted">${item.product.sku ? 'SKU: ' + item.product.sku : ''}</small>
                    </div>
                </div>
            </td>
            <td>
                <span class="h6 mb-0">${this.formatCurrency(item.product.price)}</span>
            </td>
            <td>
                <div class="input-group input-group-sm" style="width: 120px;">
                    <button class="btn btn-outline-secondary quantity-minus" type="button"
                            data-item-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="form-control text-center quantity-input"
                           value="${item.quantity}"
                           min="1"
                           max="${item.product.stock}"
                           data-item-id="${item.id}">
                    <button class="btn btn-outline-secondary quantity-plus" type="button"
                            data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                ${item.quantity > item.product.stock ?
            `<small class="text-danger stock-warning">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        Chỉ còn ${item.product.stock} sản phẩm
                    </small>` : ''}
            </td>
            <td>
                <span class="h6 text-primary fw-bold">${this.formatCurrency(item.subtotal)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-item-btn"
                        data-item-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    updateCartSummary() {
        document.getElementById('subtotalAmount').textContent = this.formatCurrency(this.cartData.totalPrice);
        document.getElementById('totalAmount').textContent = this.formatCurrency(this.cartData.totalPrice);
    }

    // Cập nhật số lượng sản phẩm
    updateQuantity(itemId, change, button) {
        const input = document.querySelector(`input[data-item-id="${itemId}"]`);
        let newQuantity = parseInt(input.value) + change;

        if (newQuantity < 1) newQuantity = 1;

        // Kiểm tra số lượng tồn kho
        const maxStock = parseInt(input.getAttribute('max'));
        if (newQuantity > maxStock) {
            this.showToast('warning', 'Cảnh báo', `Chỉ còn ${maxStock} sản phẩm trong kho`);
            newQuantity = maxStock;
        }

        input.value = newQuantity;
        this.updateCartItem(itemId, newQuantity, button);
    }

    // Cập nhật số lượng từ input
    updateQuantityInput(input) {
        const itemId = input.getAttribute('data-item-id');
        let newQuantity = parseInt(input.value);

        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
            input.value = 1;
        }

        // Kiểm tra số lượng tồn kho
        const maxStock = parseInt(input.getAttribute('max'));
        if (newQuantity > maxStock) {
            this.showToast('warning', 'Cảnh báo', `Chỉ còn ${maxStock} sản phẩm trong kho`);
            newQuantity = maxStock;
            input.value = maxStock;
        }

        this.updateCartItem(itemId, newQuantity, input);
    }

    // Gửi yêu cầu cập nhật giỏ hàng - Sửa để khớp với API
    updateCartItem(itemId, quantity, targetElement) {
        this.setButtonLoading(targetElement, true);

        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        // Sử dụng PUT /api/cart/item/{itemId}?quantity={quantity}
        $.ajax({
            url: `/api/cart/item/${itemId}?quantity=${quantity}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [header]: token
            },
            success: (data) => {
                // API trả về CartDTO trực tiếp
                this.cartData = data;
                this.displayCartData();
                this.showToast('success', 'Thành công', 'Đã cập nhật giỏ hàng');
            },
            error: (xhr, status, error) => {
                console.error('Error:', error);
                let errorMessage = 'Có lỗi xảy ra khi kết nối đến server';

                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.error) {
                        errorMessage = errorResponse.error;
                    }
                } catch (e) {
                    // Nếu không parse được JSON, giữ nguyên errorMessage
                }

                this.showToast('error', 'Lỗi', errorMessage);
                this.loadCartData(); // Reload on error
            },
            complete: () => {
                this.setButtonLoading(targetElement, false);
            }
        });
    }

    // Xóa sản phẩm khỏi giỏ hàng - Sửa để khớp với API
    removeItem(itemId, button) {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            return;
        }

        this.setButtonLoading(button, true);

        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        // Sử dụng DELETE /api/cart/item/{itemId}
        $.ajax({
            url: `/api/cart/item/${itemId}`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                [header]: token
            },
            success: (data) => {
                this.showToast('success', 'Thành công', 'Đã xóa sản phẩm khỏi giỏ hàng');
                // Load lại dữ liệu giỏ hàng sau khi xóa
                this.loadCartData();
            },
            error: (xhr, status, error) => {
                console.error('Error:', error);
                let errorMessage = 'Có lỗi xảy ra khi kết nối đến server';

                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.error) {
                        errorMessage = errorResponse.error;
                    }
                } catch (e) {
                    // Nếu không parse được JSON, giữ nguyên errorMessage
                }

                this.showToast('error', 'Lỗi', errorMessage);
            },
            complete: () => {
                this.setButtonLoading(button, false);
            }
        });
    }

    // Xóa toàn bộ giỏ hàng - Sửa để khớp với API
    clearCart() {
        if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            return;
        }

        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        // Sử dụng DELETE /api/cart/clear
        $.ajax({
            url: '/api/cart/clear',
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                [header]: token
            },
            success: (data) => {
                this.showToast('success', 'Thành công', 'Đã xóa toàn bộ giỏ hàng');
                this.cartData = {items: [], totalPrice: 0};
                this.displayCartData();
            },
            error: (xhr, status, error) => {
                console.error('Error:', error);
                let errorMessage = 'Có lỗi xảy ra khi kết nối đến server';

                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.error) {
                        errorMessage = errorResponse.error;
                    }
                } catch (e) {
                    // Nếu không parse được JSON, giữ nguyên errorMessage
                }

                this.showToast('error', 'Lỗi', errorMessage);
            }
        });
    }

    // Hiệu ứng loading khi thao tác với giỏ hàng
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('btn-loading');
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
        }
    }

    // Hiển thị thông báo toast
    showToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}:</strong> ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        document.getElementById('toastContainer').appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Tự động xóa toast sau khi ẩn
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
    }

    formatCurrency(amount) {
        try {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        } catch (error) {
            return amount + ' VND';
        }
    }

    showEmptyCart() {
        document.getElementById('emptyCart').classList.remove('d-none');
        document.getElementById('cartContent').classList.add('d-none');
        document.getElementById('errorMessage').classList.add('d-none');
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.remove('d-none');
        document.getElementById('cartContent').classList.add('d-none');
        document.getElementById('emptyCart').classList.add('d-none');
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        document.getElementById('cartContent').classList.add('d-none');
        document.getElementById('emptyCart').classList.add('d-none');
        document.getElementById('errorMessage').classList.add('d-none');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('d-none');
    }
}

// Initialize when document is ready
$(document).ready(function () {
    window.cartClient = new CartClient();
});