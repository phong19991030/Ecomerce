// src/main/resources/static/js/admin/admin-dashboard.js
class AdminDashboardManager {
    constructor() {
        this.csrfToken = $("meta[name='_csrf']").attr("content");
        this.csrfHeader = $("meta[name='_csrf_header']").attr("content");
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        $('#refreshDashboard').on('click', () => {
            this.loadDashboardData();
        });
    }

    loadDashboardData() {
        this.showLoading();

        // Sử dụng jQuery Ajax để load dữ liệu song song
        $.when(
            this.loadStatistics(),
            this.loadRecentOrders(),
            this.loadTopProducts()
        ).done(() => {
            this.hideLoading();
        }).fail((error) => {
            console.error('Error loading dashboard data:', error);
            this.showError('Lỗi khi tải dữ liệu dashboard');
            this.hideLoading();
        });
    }

    loadStatistics() {
        const deferred = $.Deferred();

        // Load số lượng người dùng
        $.ajax({
            url: '/admin/users/api',
            type: 'GET',
            data: {page: 0, size: 1}, // Chỉ lấy trang đầu để đếm
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (response) => {
                const totalUsers = response.totalItems || 0;
                $('#totalUsers').text(totalUsers);

                // Load số lượng sản phẩm
                $.ajax({
                    url: '/admin/api/products/count',
                    type: 'GET',
                    headers: {
                        [this.csrfHeader]: this.csrfToken
                    },
                    success: (productCount) => {
                        $('#totalProducts').text(productCount || 0);

                        // Load số lượng đơn hàng
                        $.ajax({
                            url: '/api/admin/orders',
                            type: 'GET',
                            data: {page: 0, size: 1}, // Chỉ lấy trang đầu để đếm
                            headers: {
                                [this.csrfHeader]: this.csrfToken
                            },
                            success: (ordersResponse) => {
                                const totalOrders = ordersResponse.totalElements || 0;
                                $('#totalOrders').text(totalOrders);

                                // Load tổng doanh thu (cần API riêng hoặc tính toán)
                                this.loadTotalRevenue().then(() => {
                                    deferred.resolve();
                                });
                            },
                            error: (xhr, status, error) => {
                                console.error('Error loading orders count:', error);
                                $('#totalOrders').text('0');
                                deferred.resolve();
                            }
                        });
                    },
                    error: (xhr, status, error) => {
                        console.error('Error loading product count:', error);
                        $('#totalProducts').text('0');
                        $('#totalOrders').text('0');
                        deferred.resolve();
                    }
                });
            },
            error: (xhr, status, error) => {
                console.error('Error loading users count:', error);
                $('#totalUsers').text('0');
                $('#totalProducts').text('0');
                $('#totalOrders').text('0');
                deferred.resolve();
            }
        });

        return deferred.promise();
    }

    loadTotalRevenue() {
        const deferred = $.Deferred();

        // Tạm thời lấy 100 đơn hàng gần nhất để tính doanh thu
        $.ajax({
            url: '/api/admin/orders',
            type: 'GET',
            data: {page: 0, size: 100, sortDirection: 'desc'},
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (response) => {
                let totalRevenue = 0;
                if (response.content && Array.isArray(response.content)) {
                    response.content.forEach(order => {
                        if (order.totalAmount &&
                            (order.paymentStatus === 'PAID' || order.status === 'DELIVERED')) {
                            totalRevenue += parseFloat(order.totalAmount) || 0;
                        }
                    });
                }
                $('#totalRevenue').text(this.formatCurrencyVND(totalRevenue));
                deferred.resolve();
            },
            error: (xhr, status, error) => {
                console.error('Error loading revenue data:', error);
                $('#totalRevenue').text('0 VND');
                deferred.resolve();
            }
        });

        return deferred.promise();
    }

    loadRecentOrders() {
        const deferred = $.Deferred();

        $.ajax({
            url: '/api/admin/orders',
            type: 'GET',
            data: {
                page: 0,
                size: 5,
                sortBy: 'orderDate',
                sortDirection: 'desc'
            },
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (response) => {
                if (response.content && response.content.length > 0) {
                    this.displayRecentOrders(response.content);
                } else {
                    this.showEmptyRecentOrders();
                }
                deferred.resolve();
            },
            error: (xhr, status, error) => {
                console.error('Error loading recent orders:', error);
                this.showEmptyRecentOrders();
                deferred.resolve();
            }
        });

        return deferred.promise();
    }

    loadTopProducts() {
        const deferred = $.Deferred();

        // Tạm thời lấy sản phẩm mới nhất, có thể cải tiến thành API thống kê sau
        $.ajax({
            url: '/admin/api/products',
            type: 'GET',
            data: {
                page: 0,
                size: 5,
                sortBy: 'id',
                sortDirection: 'desc',
                active: true
            },
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (response) => {
                if (response.content && response.content.length > 0) {
                    this.displayTopProducts(response.content);
                } else {
                    this.showEmptyTopProducts();
                }
                deferred.resolve();
            },
            error: (xhr, status, error) => {
                console.error('Error loading top products:', error);
                this.showEmptyTopProducts();
                deferred.resolve();
            }
        });

        return deferred.promise();
    }

    displayRecentOrders(orders) {
        const tbody = $('#recentOrdersTable tbody');
        if (tbody.length === 0) {
            console.error('Recent orders table body not found');
            return;
        }

        tbody.empty();

        orders.forEach(order => {
            const row = this.createRecentOrderRow(order);
            tbody.append(row);
        });

        $('#recentOrdersSection').show();
        $('#emptyRecentOrders').hide();
    }

    createRecentOrderRow(order) {
        const customerName = order.customerName || 'Khách hàng';
        const amount = order.totalAmount || 0;
        const status = order.status || 'PENDING';

        return `
            <tr>
                <td><strong>${order.orderNumber || 'N/A'}</strong></td>
                <td>${this.escapeHtml(customerName)}</td>
                <td>${this.formatCurrencyVND(amount)}</td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(status)}">
                        ${this.getStatusText(status)}
                    </span>
                </td>
            </tr>
        `;
    }

    displayTopProducts(products) {
        const tbody = $('#topProductsTable tbody');
        if (tbody.length === 0) {
            console.error('Top products table body not found');
            return;
        }

        tbody.empty();

        products.forEach(product => {
            const row = this.createTopProductRow(product);
            tbody.append(row);
        });

        $('#topProductsSection').show();
        $('#emptyTopProducts').hide();
    }

    createTopProductRow(product) {
        // Tạm thời sử dụng giá trị mặc định, có thể cải tiến với API thống kê thực
        const sold = product.stock || 0; // Đây chỉ là ví dụ, cần API thống kê thực
        const revenue = (product.price || 0) * sold;

        return `
            <tr>
                <td>${this.escapeHtml(product.name || 'N/A')}</td>
                <td>${sold}</td>
                <td>${this.formatCurrencyVND(revenue)}</td>
            </tr>
        `;
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

    // Format tiền VND không có .00 ở cuối
    formatCurrencyVND(amount) {
        if (amount === null || amount === undefined) {
            return '0 VND';
        }

        const number = parseFloat(amount);
        if (isNaN(number)) {
            return '0 VND';
        }

        // Làm tròn đến hàng đơn vị (bỏ phần thập phân)
        const roundedNumber = Math.round(number);

        // Format theo kiểu Việt Nam: 1.000.000 VND
        return roundedNumber.toLocaleString('vi-VN') + ' VND';
    }

    // Giữ lại hàm format cũ cho các trường hợp cần
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        $('#dashboardLoading').show();
        $('#dashboardError').addClass('d-none');
        $('#dashboardContent').addClass('d-none');
    }

    hideLoading() {
        $('#dashboardLoading').hide();
        $('#dashboardError').addClass('d-none');
        $('#dashboardContent').removeClass('d-none');
    }

    showError(message) {
        $('#dashboardLoading').hide();
        $('#dashboardErrorText').text(message);
        $('#dashboardError').removeClass('d-none');
        $('#dashboardContent').addClass('d-none');
    }

    showEmptyRecentOrders() {
        $('#recentOrdersSection').hide();
        $('#emptyRecentOrders').show();
    }

    showEmptyTopProducts() {
        $('#topProductsSection').hide();
        $('#emptyTopProducts').show();
    }
}

// Initialize when document is ready
$(document).ready(function () {
    if ($('#dashboardContent').length) {
        window.adminDashboardManager = new AdminDashboardManager();
    } else {
        console.warn('Admin dashboard elements not found, skipping initialization');
    }
});