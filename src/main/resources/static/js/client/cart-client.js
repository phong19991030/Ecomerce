// src/main/resources/static/js/cart.js
class CartManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners are handled by inline functions in the HTML
    }

    async updateQuantity(itemId, newQuantity) {
        try {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch(`/api/cart/item/${itemId}?quantity=${newQuantity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                ToastService.success('Cập nhật giỏ hàng thành công');
                // Reload the page to reflect changes
                setTimeout(() => location.reload(), 1000);
            } else {
                const error = await response.json();
                ToastService.error('Lỗi: ' + (error.error || 'Không thể cập nhật'));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            ToastService.error('Lỗi khi cập nhật giỏ hàng');
        }
    }

    async removeItem(itemId) {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            return;
        }

        try {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch(`/api/cart/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                ToastService.success('Đã xóa sản phẩm khỏi giỏ hàng');
                // Reload the page
                setTimeout(() => location.reload(), 1000);
            } else {
                const error = await response.json();
                ToastService.error('Lỗi: ' + (error.error || 'Không thể xóa'));
            }
        } catch (error) {
            console.error('Error removing item:', error);
            ToastService.error('Lỗi khi xóa sản phẩm');
        }
    }

    async clearCart() {
        if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
            return;
        }

        try {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch('/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                ToastService.success('Đã xóa toàn bộ giỏ hàng');
                // Reload the page
                setTimeout(() => location.reload(), 1000);
            } else {
                const error = await response.json();
                ToastService.error('Lỗi: ' + (error.error || 'Không thể xóa'));
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            ToastService.error('Lỗi khi xóa giỏ hàng');
        }
    }
}

// Global functions for inline event handlers
function updateQuantity(button, change) {
    const itemId = $(button).data('item-id');
    const input = $(button).closest('.input-group').find('input');
    let newQuantity = parseInt(input.val()) + change;

    // Ensure quantity is at least 1
    newQuantity = Math.max(1, newQuantity);

    const cartManager = new CartManager();
    cartManager.updateQuantity(itemId, newQuantity);
}

function updateQuantityInput(input) {
    const itemId = $(input).data('item-id');
    let newQuantity = parseInt(input.value);

    // Ensure quantity is at least 1
    newQuantity = Math.max(1, newQuantity);

    const cartManager = new CartManager();
    cartManager.updateQuantity(itemId, newQuantity);
}

function removeItem(button) {
    const itemId = $(button).data('item-id');
    const cartManager = new CartManager();
    cartManager.removeItem(itemId);
}

function clearCart() {
    const cartManager = new CartManager();
    cartManager.clearCart();
}

// Initialize when document is ready
$(document).ready(function() {
    window.cartManager = new CartManager();
});