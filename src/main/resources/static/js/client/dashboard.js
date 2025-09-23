// src/main/resources/static/js/client/dashboard.js
class DashboardManager {
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
            this.loadRecommendedProducts()
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

        // Sử dụng Ajax để load số lượng đơn hàng
        $.ajax({
            url: '/api/orders/count',
            type: 'GET',
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (ordersCount) => {
                $('#totalOrders').text(ordersCount || 0);

                // Load số lượng sản phẩm trong giỏ hàng
                $.ajax({
                    url: '/api/cart/count',
                    type: 'GET',
                    headers: {
                        [this.csrfHeader]: this.csrfToken
                    },
                    success: (cartCount) => {
                        $('#cartItems').text(cartCount || 0);
                        deferred.resolve();
                    },
                    error: (xhr, status, error) => {
                        console.error('Error loading cart count:', error);
                        $('#cartItems').text('0');
                        deferred.resolve(); // Vẫn resolve để không block các request khác
                    }
                });
            },
            error: (xhr, status, error) => {
                console.error('Error loading orders count:', error);
                $('#totalOrders').text('0');
                $('#cartItems').text('0');
                deferred.resolve(); // Vẫn resolve để không block các request khác
            }
        });

        return deferred.promise();
    }

    loadRecentOrders() {
        const deferred = $.Deferred();

        $.ajax({
            url: '/api/orders',
            type: 'GET',
            headers: {
                [this.csrfHeader]: this.csrfToken
            },
            success: (orders) => {
                if (!orders || orders.length === 0) {
                    this.showEmptyRecentOrders();
                } else {
                    const recentOrders = orders.slice(0, 5);
                    this.displayRecentOrders(recentOrders);
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

    loadRecommendedProducts() {
        const deferred = $.Deferred();

        // Sử dụng API categories để lấy danh mục sản phẩm làm gợi ý
        $.ajax({
            url: '/api/public/categories/active',
            type: 'GET',
            success: (categories) => {
                if (categories && categories.length > 0) {
                    // Lấy tên các danh mục làm gợi ý
                    const recommendedProducts = categories.slice(0, 4).map(category =>
                        category.name || category.description || 'Sản phẩm ' + category.id
                    );
                    this.displayRecommendedProducts(recommendedProducts);
                } else {
                    // Fallback nếu không có danh mục
                    this.displayRecommendedProducts([
                        "Điện thoại thông minh",
                        "Laptop & Máy tính",
                        "Phụ kiện công nghệ",
                        "Thiết bị gia dụng"
                    ]);
                }
                deferred.resolve();
            },
            error: (xhr, status, error) => {
                console.error('Error loading categories:', error);

                // Thử API khác nếu API active không hoạt động
                $.ajax({
                    url: '/api/public/categories/find_all',
                    type: 'GET',
                    success: (categories) => {
                        if (categories && categories.length > 0) {
                            const recommendedProducts = categories.slice(0, 4).map(category =>
                                category.name || category.description || 'Sản phẩm ' + category.id
                            );
                            this.displayRecommendedProducts(recommendedProducts);
                        } else {
                            this.displayRecommendedProducts([]);
                        }
                        deferred.resolve();
                    },
                    error: (xhr2, status2, error2) => {
                        console.error('Error loading all categories:', error2);
                        this.displayRecommendedProducts([]);
                        deferred.resolve();
                    }
                });
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
        // Lấy tên sản phẩm đầu tiên hoặc số lượng sản phẩm
        let productName = 'Không có sản phẩm';
        if (order.items && order.items.length > 0) {
            productName = order.items[0].productName ||
                order.items[0].name ||
                `${order.items.length} sản phẩm`;
        }

        return `
            <tr>
                <td><strong>${order.orderNumber || 'N/A'}</strong></td>
                <td>${productName}</td>
                <td><span class="fw-bold text-primary">${this.formatCurrency(order.totalAmount || 0)} VND</span></td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(order.status || 'PENDING')}">
                        ${this.getStatusText(order.status || 'PENDING')}
                    </span>
                </td>
            </tr>
        `;
    }

    displayRecommendedProducts(products) {
        const list = $('#recommendedProductsList');
        if (list.length === 0) {
            console.error('Recommended products list not found');
            return;
        }

        list.empty();

        if (!products || products.length === 0) {
            list.append(`
                <li class="list-group-item text-muted">
                    <i class="fas fa-info-circle me-2"></i>Chưa có gợi ý
                </li>
            `);
            return;
        }

        products.forEach(product => {
            list.append(`
                <li class="list-group-item">
                    <i class="fas fa-arrow-right text-primary me-2"></i>
                    ${this.escapeHtml(product)}
                </li>
            `);
        });
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
            'ĐÃ GIAO HÀNG': 'Đã giao hàng',
            'ĐANG XỬ LÝ': 'Đang xử lý',
            'ĐANG GIAO HÀNG': 'Đang giao hàng',
            'ĐÃ HỦY': 'Đã hủy'
        };
        return statusMap[statusUpper] || status || 'Đang xử lý';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
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
}

// Initialize when document is ready
$(document).ready(function () {
    // Kiểm tra xem có phần tử dashboard không trước khi khởi tạo
    if ($('#dashboardContent').length) {
        window.dashboardManager = new DashboardManager();
    } else {
        console.warn('Dashboard elements not found, skipping initialization');
    }
});