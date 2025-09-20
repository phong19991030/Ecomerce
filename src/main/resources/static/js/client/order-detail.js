// src/main/resources/static/js/client/order-detail.js
class OrderDetailManager {
    constructor() {
        this.orderNumber = this.getOrderNumberFromUrl();
        this.init();
    }

    getOrderNumberFromUrl() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    init() {
        if (this.orderNumber) {
            this.loadOrderDetail(this.orderNumber);
        } else {
            this.showError('Không tìm thấy mã đơn hàng');
        }
    }

    async loadOrderDetail(orderNumber) {
        try {
            this.showLoading();

            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch(`/api/orders/${orderNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                const order = await response.json();
                this.displayOrderDetail(order);
            } else if (response.status === 401) {
                this.showError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (response.status === 403) {
                this.showError('Bạn không có quyền truy cập đơn hàng này');
            } else if (response.status === 404) {
                this.showOrderNotFound();
            } else {
                const error = await response.json();
                this.showError('Lỗi: ' + (error.error || 'Không thể tải chi tiết đơn hàng'));
            }
        } catch (error) {
            console.error('Error loading order detail:', error);
            this.showError('Lỗi khi tải chi tiết đơn hàng');
        }
    }

    displayOrderDetail(order) {
        this.hideLoading();

        const orderDetailsDiv = document.getElementById('orderDetails');
        orderDetailsDiv.innerHTML = this.createOrderDetailHTML(order);

        this.showOrderDetails();
    }

    createOrderDetailHTML(order) {
        return `
            <div class="card-header bg-light">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">
                        <i class="fas fa-receipt me-2"></i>Đơn hàng #${order.orderNumber}
                    </h4>
                    <div>
                        <span class="badge me-2 ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
                        <span class="badge ${this.getPaymentStatusBadgeClass(order.paymentStatus)}">${order.paymentStatus}</span>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <!-- Order Information -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h5><i class="fas fa-truck me-2"></i>Thông tin giao hàng</h5>
                        <div class="ms-4">
                            <p><strong>Họ tên:</strong> ${order.customerName}</p>
                            <p><strong>Email:</strong> ${order.customerEmail}</p>
                            <p><strong>Điện thoại:</strong> ${order.customerPhone}</p>
                            <p><strong>Địa chỉ:</strong> ${order.shippingAddress}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5><i class="fas fa-credit-card me-2"></i>Thông tin thanh toán</h5>
                        <div class="ms-4">
                            <p><strong>Phương thức:</strong> ${order.paymentMethod}</p>
                            <p><strong>Trạng thái:</strong> 
                                <span class="badge ${this.getPaymentStatusBadgeClass(order.paymentStatus)}">${order.paymentStatus}</span>
                            </p>
                            <p><strong>Ngày đặt:</strong> ${this.formatDateTime(order.orderDate)}</p>
                            <p><strong>Cập nhật:</strong> ${this.formatDateTime(order.updatedDate)}</p>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <h5><i class="fas fa-shopping-bag me-2"></i>Chi tiết sản phẩm</h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => this.createOrderItemHTML(item)).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Order Summary -->
                <div class="row justify-content-end">
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h6 class="card-title">Tổng cộng</h6>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>${this.formatCurrency(order.totalAmount)} VND</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span class="text-success">Miễn phí</span>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between">
                                    <strong>Tổng tiền:</strong>
                                    <strong class="text-primary">${this.formatCurrency(order.totalAmount)} VND</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                ${order.status === 'PENDING' ? `
                <div class="mt-4">
                    <button class="btn btn-danger" onclick="orderDetailManager.cancelOrder('${order.orderNumber}')">
                        <i class="fas fa-times me-2"></i>Hủy đơn hàng
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    }

    createOrderItemHTML(item) {
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.product.imageUrl || '/images/placeholder-product.png'}" 
                             alt="${item.product.name}"
                             class="order-item-image me-3"
                             onerror="this.src='/images/placeholder-product.png'">
                        <div>
                            <h6 class="mb-1">${item.product.name}</h6>
                            ${item.product.sku ? `<small class="text-muted">SKU: ${item.product.sku}</small><br>` : ''}
                            ${item.product.brand ? `<small class="text-muted">Thương hiệu: ${item.product.brand}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="h6 mb-0">${this.formatCurrency(item.unitPrice)} VND</span>
                </td>
                <td>${item.quantity}</td>
                <td>
                    <span class="h6 text-primary">${this.formatCurrency(item.subtotal)} VND</span>
                </td>
            </tr>
        `;
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'DELIVERED': return 'bg-success';
            case 'PROCESSING': return 'bg-warning';
            case 'PENDING': return 'bg-info';
            case 'CANCELLED': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    getPaymentStatusBadgeClass(paymentStatus) {
        return paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning';
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    showLoading() {
        $('#loadingSpinner').show();
        $('#errorMessage').addClass('d-none');
        $('#orderNotFound').addClass('d-none');
        $('#orderDetails').addClass('d-none');
    }

    hideLoading() {
        $('#loadingSpinner').hide();
    }

    showError(message) {
        this.hideLoading();
        $('#errorText').text(message);
        $('#errorMessage').removeClass('d-none');
        $('#orderNotFound').addClass('d-none');
        $('#orderDetails').addClass('d-none');
    }

    showOrderNotFound() {
        this.hideLoading();
        $('#errorMessage').addClass('d-none');
        $('#orderNotFound').removeClass('d-none');
        $('#orderDetails').addClass('d-none');
    }

    showOrderDetails() {
        this.hideLoading();
        $('#errorMessage').addClass('d-none');
        $('#orderNotFound').addClass('d-none');
        $('#orderDetails').removeClass('d-none');
    }

    async cancelOrder(orderNumber) {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch(`/api/orders/${orderNumber}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                ToastService.success('Hủy đơn hàng thành công!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const error = await response.json();
                ToastService.error('Lỗi: ' + (error.error || 'Không thể hủy đơn hàng'));
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            ToastService.error('Lỗi khi hủy đơn hàng');
        }
    }
}

// Initialize when document is ready
$(document).ready(function() {
    window.orderDetailManager = new OrderDetailManager();
});