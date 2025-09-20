// src/main/resources/static/js/client/orders.js
class OrdersManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Refresh button or other event listeners can be added here
    }

    async loadOrders() {
        try {
            this.showLoading();

            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                const orders = await response.json();
                this.displayOrders(orders);
            } else if (response.status === 401) {
                this.showError('Vui lòng đăng nhập để xem đơn hàng');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const error = await response.json();
                this.showError('Lỗi: ' + (error.error || 'Không thể tải danh sách đơn hàng'));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Lỗi khi tải danh sách đơn hàng');
        }
    }

    displayOrders(orders) {
        this.hideLoading();

        if (!orders || orders.length === 0) {
            this.showEmptyOrders();
            return;
        }

        const tableBody = document.getElementById('ordersTableBody');
        tableBody.innerHTML = '';

        orders.forEach(order => {
            const row = this.createOrderRow(order);
            tableBody.appendChild(row);
        });

        this.showOrdersList();
    }

    createOrderRow(order) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <strong>${order.orderNumber}</strong>
            </td>
            <td>${this.formatDate(order.orderDate)}</td>
            <td>${order.items.length} sản phẩm</td>
            <td>
                <span class="fw-bold text-primary">${this.formatCurrency(order.totalAmount)} VND</span>
            </td>
            <td>
                <span class="badge ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
            </td>
            <td>
                <span class="badge ${this.getPaymentStatusBadgeClass(order.paymentStatus)}">${order.paymentStatus}</span>
            </td>
            <td>
                <a href="/orders/${order.orderNumber}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye me-1"></i>Xem
                </a>
            </td>
        `;

        return row;
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    showLoading() {
        $('#loadingSpinner').show();
        $('#errorMessage').addClass('d-none');
        $('#emptyOrders').addClass('d-none');
        $('#ordersList').addClass('d-none');
    }

    hideLoading() {
        $('#loadingSpinner').hide();
    }

    showError(message) {
        this.hideLoading();
        $('#errorText').text(message);
        $('#errorMessage').removeClass('d-none');
        $('#emptyOrders').addClass('d-none');
        $('#ordersList').addClass('d-none');
    }

    showEmptyOrders() {
        $('#errorMessage').addClass('d-none');
        $('#emptyOrders').removeClass('d-none');
        $('#ordersList').addClass('d-none');
    }

    showOrdersList() {
        $('#errorMessage').addClass('d-none');
        $('#emptyOrders').addClass('d-none');
        $('#ordersList').removeClass('d-none');
    }
}

// Initialize when document is ready
$(document).ready(function() {
    window.ordersManager = new OrdersManager();
});