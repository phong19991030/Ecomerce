// /js/client/order-success.js
class OrderSuccessManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadOrderDetails();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Có thể thêm các event listeners khác nếu cần
    }

    loadOrderDetails() {
        try {
            this.showLoading();

            // Lấy orderNumber từ meta tag (được truyền từ model qua Thymeleaf)
            const orderNumberMeta = document.querySelector('meta[name="orderNumber"]');
            let orderNumber = orderNumberMeta ? orderNumberMeta.getAttribute('content') : null;

            console.log('Order number from meta tag:', orderNumber);

            // Fallback: Nếu không có từ meta tag, thử lấy từ URL path
            if (!orderNumber) {
                const pathParts = window.location.pathname.split('/');
                orderNumber = pathParts[pathParts.length - 1];
                console.log('Order number from URL path (fallback):', orderNumber);
            }

            // Fallback 2: Nếu vẫn không có, thử lấy từ URL parameters
            if (!orderNumber || orderNumber === 'success') {
                const urlParams = new URLSearchParams(window.location.search);
                orderNumber = urlParams.get('orderNumber');
                console.log('Order number from URL params (fallback):', orderNumber);
            }

            if (!orderNumber) {
                this.showError('Không tìm thấy mã đơn hàng. Vui lòng kiểm tra lại URL.');
                return;
            }

            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");

            $.ajax({
                url: `/api/orders/success/${orderNumber}`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                success: (data, textStatus, xhr) => {
                    if (data && data.success && data.order) {
                        this.displayOrderSuccess(data.order);
                    } else {
                        this.showError(data.error || 'Đơn hàng không tồn tại');
                    }
                },
                error: (xhr, status, error) => {
                    let errorMessage = 'Lỗi khi tải đơn hàng';

                    if (xhr.status === 401 || xhr.status === 403) {
                        errorMessage = 'Bạn không có quyền xem đơn hàng này. Vui lòng đăng nhập.';
                        setTimeout(() => {
                            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                        }, 2000);
                    } else if (xhr.status === 404) {
                        errorMessage = 'Không tìm thấy đơn hàng với mã: ' + orderNumber;
                    } else {
                        errorMessage = 'Lỗi server khi tải đơn hàng. Status: ' + xhr.status;
                    }

                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        if (errorResponse.error) {
                            errorMessage = errorResponse.error;
                        }
                    } catch (e) {
                        // Nếu không parse được JSON, giữ nguyên errorMessage
                    }

                    this.showError(errorMessage);
                    console.error('Error loading order:', errorMessage);
                },
                complete: () => {
                    this.hideLoading();
                }
            });

        } catch (error) {
            console.error('Error in load process:', error);
            this.showError('Lỗi khi tải thông tin đơn hàng');
            this.hideLoading();
        }
    }

    displayOrderSuccess(order) {
        console.log('Rendering order:', order);

        // Update order information
        $('#orderNumber').text(order.orderNumber || 'N/A');
        $('#totalAmount').text(this.formatCurrency(order.totalAmount || 0));
        $('#customerName').text(order.customerName || 'N/A');
        $('#customerPhone').text(order.customerPhone || 'N/A');
        $('#customerEmail').text(order.customerEmail || 'N/A');
        $('#shippingAddress').text(order.shippingAddress || 'N/A');
        $('#paymentMethod').text(this.getPaymentMethodText(order.paymentMethod));
        $('#paymentStatus').text(order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán');
        $('#orderDate').text(this.formatDateTime(order.orderDate));

        // Update view order detail link
        const viewOrderBtn = document.getElementById('viewOrderDetail');
        if (viewOrderBtn && order.orderNumber) {
            viewOrderBtn.href = `/orders/${order.orderNumber}`;
        }

        // Show success content
        $('#successContent').removeClass('d-none');
        $('#errorMessage').addClass('d-none');
    }

    getPaymentMethodText(method) {
        const methods = {
            'COD': 'Thanh toán khi nhận hàng',
            'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
            'CREDIT_CARD': 'Thẻ tín dụng',
            'MOMO': 'Ví MoMo',
            'VNPAY': 'VNPay'
        };
        return methods[method] || method || 'N/A';
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

    formatDateTime(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString || 'N/A';
        }
    }

    showError(message) {
        this.hideLoading();
        $('#errorText').text(message);
        $('#errorMessage').removeClass('d-none');
        $('#successContent').addClass('d-none');
    }

    showLoading() {
        $('#loadingSpinner').removeClass('d-none');
        $('#errorMessage').addClass('d-none');
        $('#successContent').addClass('d-none');
    }

    hideLoading() {
        $('#loadingSpinner').addClass('d-none');
    }
}

// Initialize when document is ready
$(document).ready(function () {
    window.orderSuccessManager = new OrderSuccessManager();
});