// src/main/resources/static/js/admin/admin-orders.js
class AdminOrdersManager {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 10;
        this.totalPages = 0;
        this.filters = {
            status: '',
            paymentStatus: '',
            search: ''
        };
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
    }

    setupEventListeners() {
        $('#statusFilter').change(() => this.applyFilters());
        $('#paymentStatusFilter').change(() => this.applyFilters());
        $('#searchInput').keypress((e) => {
            if (e.which === 13) this.applyFilters();
        });
    }

    async loadOrders(page = 0) {
        try {
            this.showLoading();
            this.currentPage = page;

            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            // Thêm các tham số filter vào URL
            const params = new URLSearchParams({
                page: page,
                size: this.pageSize,
                sortBy: 'orderDate',
                sortDirection: 'desc'
            });

            // Thêm các filter nếu có giá trị
            if (this.filters.status) {
                params.append('status', this.filters.status);
            }
            if (this.filters.paymentStatus) {
                params.append('paymentStatus', this.filters.paymentStatus);
            }
            if (this.filters.search) {
                params.append('search', this.filters.search);
            }

            const response = await fetch(`/api/admin/orders?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.displayOrders(data);
            } else {
                const error = await response.json();
                this.showError('Lỗi: ' + (error.error || 'Không thể tải danh sách đơn hàng'));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Lỗi khi tải danh sách đơn hàng');
        }
    }

    applyFilters() {
        this.filters = {
            status: $('#statusFilter').val(),
            paymentStatus: $('#paymentStatusFilter').val(),
            search: $('#searchInput').val().trim()
        };
        this.loadOrders(0);
    }

    displayOrders(data) {
        this.hideLoading();

        if (!data.content || data.content.length === 0) {
            this.showEmptyOrders();
            return;
        }

        const tableBody = document.getElementById('ordersTableBody');
        tableBody.innerHTML = '';

        data.content.forEach(order => {
            const row = this.createOrderRow(order);
            tableBody.appendChild(row);
        });

        this.updatePagination(data);
        this.showOrdersTable();
    }

    createOrderRow(order) {
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>
            <strong>${order.orderNumber}</strong>
        </td>
        <td>
            <div>
                <div>${order.customerName}</div>
                <small class="text-muted">${order.customerEmail}</small>
            </div>
        </td>
        <td>${order.items.length} sản phẩm</td>
        <td>
            <span class="fw-bold text-primary">${this.formatCurrency(order.totalAmount)} VND</span>
        </td>
        <td>
            <span class="badge ${this.getStatusBadgeClass(order.status)}">${this.getStatusText(order.status)}</span>
        </td>
        <td>
            <span class="badge ${this.getPaymentStatusBadgeClass(order.paymentStatus)}" 
                  data-bs-toggle="tooltip" 
                  title="${this.getPaymentStatusFullText(order.paymentStatus)}">
                ${this.getPaymentStatusShortText(order.paymentStatus)}
            </span>
        </td>
        <td>${this.formatDate(order.orderDate)}</td>
        <td>
            <div class="btn-group">
                <!-- Chế độ view: không có tham số mode -->
                <a href="/admin/orders/${order.orderNumber}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye"></i> Xem
                </a>
                <!-- Chế độ edit: thêm tham số mode=edit -->
                <a href="/admin/orders/${order.orderNumber}?mode=edit" class="btn btn-sm btn-outline-info">
                    <i class="fas fa-edit"></i> Sửa
                </a>
            </div>
        </td>
    `;

        return row;
    }

    updatePagination(data) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        this.totalPages = data.totalPages;

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${data.first ? 'disabled' : ''}`;
        prevLi.innerHTML = `
            <a class="page-link" href="#" onclick="ordersManager.loadOrders(${data.number - 1})">
                &laquo;
            </a>
        `;
        pagination.appendChild(prevLi);

        // Page numbers
        for (let i = 0; i < data.totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === data.number ? 'active' : ''}`;
            pageLi.innerHTML = `
                <a class="page-link" href="#" onclick="ordersManager.loadOrders(${i})">
                    ${i + 1}
                </a>
            `;
            pagination.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${data.last ? 'disabled' : ''}`;
        nextLi.innerHTML = `
            <a class="page-link" href="#" onclick="ordersManager.loadOrders(${data.number + 1})">
                &raquo;
            </a>
        `;
        pagination.appendChild(nextLi);
    }

    refreshOrders() {
        this.loadOrders(this.currentPage);
    }

    getStatusBadgeClass(status) {
        const statusUpper = (status || '').toUpperCase();
        switch (statusUpper) {
            case 'DELIVERED':
            case 'ĐÃ GIAO HÀNG':
                return 'bg-success';
            case 'PROCESSING':
            case 'PENDING':
            case 'ĐANG XỬ LÝ':
                return 'bg-warning';
            case 'SHIPPED':
            case 'ĐANG GIAO HÀNG':
                return 'bg-info';
            case 'CANCELLED':
            case 'ĐÃ HỦY':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    getStatusText(status) {
        const statusUpper = (status || '').toUpperCase();
        const statusMap = {
            'DELIVERED': 'Đã giao hàng',
            'PROCESSING': 'Đang xử lý',
            'PENDING': 'Chờ xử lý',
            'SHIPPED': 'Đang giao hàng',
            'CANCELLED': 'Đã hủy',
            'PAID': 'Đã thanh toán',
            'UNPAID': 'Chưa thanh toán'
        };
        return statusMap[statusUpper] || status || 'Đang xử lý';
    }

    getPaymentStatusBadgeClass(paymentStatus) {
        const statusUpper = (paymentStatus || '').toUpperCase();
        return statusUpper === 'PAID' ? 'bg-success' : 'bg-warning';
    }

    getPaymentStatusText(paymentStatus) {
        const statusUpper = (paymentStatus || '').toUpperCase();
        const statusMap = {
            'PAID': 'Đã thanh toán',
            'UNPAID': 'Chưa thanh toán',
            'PENDING': 'Đang chờ thanh toán',
            'FAILED': 'Thanh toán thất bại',
            'REFUNDED': 'Đã hoàn tiền'
        };
        return statusMap[statusUpper] || paymentStatus || 'Chưa thanh toán';
    }

    getPaymentStatusShortText(paymentStatus) {
        const statusUpper = (paymentStatus || '').toUpperCase();
        const statusMap = {
            'PAID': 'Đã TT',
            'UNPAID': 'Chưa TT',
            'PENDING': 'Chờ TT',
            'FAILED': 'Lỗi TT',
            'REFUNDED': 'Hoàn tiền'
        };
        return statusMap[statusUpper] || paymentStatus || 'Chưa TT';
    }

    getPaymentStatusFullText(paymentStatus) {
        return this.getPaymentStatusText(paymentStatus);
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
        $('#ordersTable').addClass('d-none');
    }

    hideLoading() {
        $('#loadingSpinner').hide();
    }

    showError(message) {
        this.hideLoading();
        $('#errorText').text(message);
        $('#errorMessage').removeClass('d-none');
        $('#emptyOrders').addClass('d-none');
        $('#ordersTable').addClass('d-none');
    }

    showEmptyOrders() {
        $('#errorMessage').addClass('d-none');
        $('#emptyOrders').removeClass('d-none');
        $('#ordersTable').addClass('d-none');
    }

    showOrdersTable() {
        $('#errorMessage').addClass('d-none');
        $('#emptyOrders').addClass('d-none');
        $('#ordersTable').removeClass('d-none');

        // Khởi tạo tooltip sau khi hiển thị bảng
        $('[data-bs-toggle="tooltip"]').tooltip();
    }
}

// Initialize when document is ready
$(document).ready(function () {
    window.ordersManager = new AdminOrdersManager();
});