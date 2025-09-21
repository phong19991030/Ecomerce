// Hiệu ứng loading khi thao tác với giỏ hàng
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('btn-loading');
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
    }
}

// Cập nhật số lượng sản phẩm
function updateQuantity(button, change) {
    const itemId = button.getAttribute('data-item-id');
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    let newQuantity = parseInt(input.value) + change;

    if (newQuantity < 1) newQuantity = 1;

    // Kiểm tra số lượng tồn kho
    const maxStock = parseInt(input.getAttribute('max'));
    if (newQuantity > maxStock) {
        showToast('warning', 'Cảnh báo', `Chỉ còn ${maxStock} sản phẩm trong kho`);
        newQuantity = maxStock;
    }

    input.value = newQuantity;
    updateCartItem(itemId, newQuantity);
}

// Cập nhật số lượng từ input
function updateQuantityInput(input) {
    const itemId = input.getAttribute('data-item-id');
    let newQuantity = parseInt(input.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        input.value = 1;
    }

    // Kiểm tra số lượng tồn kho
    const maxStock = parseInt(input.getAttribute('max'));
    if (newQuantity > maxStock) {
        showToast('warning', 'Cảnh báo', `Chỉ còn ${maxStock} sản phẩm trong kho`);
        newQuantity = maxStock;
        input.value = maxStock;
    }

    updateCartItem(itemId, newQuantity);
}

// Gửi yêu cầu cập nhật giỏ hàng
function updateCartItem(itemId, quantity) {
    setButtonLoading(event.target, true);

    // Gửi yêu cầu AJAX đến server
    fetch('/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            itemId: itemId,
            quantity: quantity
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cập nhật giao diện
                location.reload(); // Tải lại trang để cập nhật thông tin mới
            } else {
                showToast('error', 'Lỗi', data.message || 'Có lỗi xảy ra khi cập nhật giỏ hàng');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Lỗi', 'Có lỗi xảy ra khi kết nối đến server');
        })
        .finally(() => {
            setButtonLoading(event.target, false);
        });
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(button) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        return;
    }

    const itemId = button.getAttribute('data-item-id');
    setButtonLoading(button, true);

    // Gửi yêu cầu AJAX đến server
    fetch('/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            itemId: itemId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('success', 'Thành công', 'Đã xóa sản phẩm khỏi giỏ hàng');
                // Xóa hàng khỏi giao diện sau 0.5s
                setTimeout(() => {
                    location.reload(); // Tải lại trang để cập nhật thông tin mới
                }, 500);
            } else {
                showToast('error', 'Lỗi', data.message || 'Có lỗi xảy ra khi xóa sản phẩm');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Lỗi', 'Có lỗi xảy ra khi kết nối đến server');
        })
        .finally(() => {
            setButtonLoading(button, false);
        });
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        return;
    }

    // Gửi yêu cầu AJAX đến server
    fetch('/cart/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('success', 'Thành công', 'Đã xóa toàn bộ giỏ hàng');
                // Tải lại trang sau 0.5s
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                showToast('error', 'Lỗi', data.message || 'Có lỗi xảy ra khi xóa giỏ hàng');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Lỗi', 'Có lỗi xảy ra khi kết nối đến server');
        });
}

// Hiển thị thông báo toast
function showToast(type, title, message) {
    // Sử dụng toast-service.js nếu có, hoặc tạo toast thủ công
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
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Khởi tạo tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});