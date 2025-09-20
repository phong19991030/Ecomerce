// src/main/resources/static/js/checkout.js
class CheckoutManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserInfo();
    }

    setupEventListeners() {
        $('#checkoutForm').on('submit', (e) => this.handleCheckout(e));
        $('#sameAsProfile').on('change', (e) => this.toggleSameAsProfile(e));
    }

    async loadUserInfo() {
        // try {
        //     // Load user profile information to pre-fill form
        //     const response = await fetch('/api/user/profile');
        //     if (response.ok) {
        //         const user = await response.json();
        //         this.prefillForm(user);
        //     }
        // } catch (error) {
        //     console.error('Error loading user info:', error);
        // }
    }

    prefillForm(user) {
        if (user.fullName) {
            $('#customerName').val(user.fullName);
        }
        if (user.email) {
            $('#customerEmail').val(user.email);
        }
        if (user.phone) {
            $('#customerPhone').val(user.phone);
        }
        if (user.address) {
            $('#shippingAddress').val(user.address);
        }
    }

    toggleSameAsProfile(e) {
        if (e.target.checked) {
            this.loadUserInfo();
        }
    }

    async handleCheckout(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        try {
            const orderData = {
                shippingAddress: $('#shippingAddress').val(),
                paymentMethod: $('input[name="paymentMethod"]:checked').val(),
                customerName: $('#customerName').val(),
                customerEmail: $('#customerEmail').val(),
                customerPhone: $('#customerPhone').val()
            };

            $.ajax({
                url: '/api/orders',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(orderData),
                beforeSend: function (xhr) {
                    const token = $("meta[name='_csrf']").attr("content");
                    const header = $("meta[name='_csrf_header']").attr("content");
                    if (token && header) {
                        xhr.setRequestHeader(header, token);
                    }
                },
                success: (order) => {
                    ToastService.success('Đặt hàng thành công!');
                    // Redirect to success page
                    setTimeout(() => {
                        window.location.href = `/orders/success/${order.orderNumber}`;
                    }, 1500);
                },
                error: (xhr, status, error) => {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        ToastService.error('Lỗi: ' + (errorResponse.error || 'Không thể đặt hàng'));
                    } catch (e) {
                        ToastService.error('Lỗi khi đặt hàng');
                    }
                    console.error('Error during checkout:', xhr.responseText);
                }
            });

        } catch (error) {
            console.error('Error during checkout:', error);
            ToastService.error('Lỗi khi đặt hàng');
        }
    }

    validateForm() {
        const name = $('#customerName').val().trim();
        const email = $('#customerEmail').val().trim();
        const phone = $('#customerPhone').val().trim();
        const address = $('#shippingAddress').val().trim();
        const paymentMethod = $('input[name="paymentMethod"]:checked').val();

        if (!name) {
            ToastService.error('Vui lòng nhập họ tên');
            return false;
        }

        if (!email) {
            ToastService.error('Vui lòng nhập email');
            return false;
        }

        if (!this.isValidEmail(email)) {
            ToastService.error('Vui lòng nhập email hợp lệ');
            return false;
        }

        if (!phone) {
            ToastService.error('Vui lòng nhập số điện thoại');
            return false;
        }

        if (!address) {
            ToastService.error('Vui lòng nhập địa chỉ giao hàng');
            return false;
        }

        if (!paymentMethod) {
            ToastService.error('Vui lòng chọn phương thức thanh toán');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize when document is ready
$(document).ready(function () {
    window.checkoutManager = new CheckoutManager();
});