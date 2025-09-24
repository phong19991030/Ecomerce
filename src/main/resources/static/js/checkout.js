// src/main/resources/static/js/checkout.js
class CheckoutManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        // this.loadUserInfo();
    }

    setupEventListeners() {
        $('#checkoutForm').on('submit', (e) => this.handleCheckout(e));
        $('#sameAsProfile').on('change', (e) => this.toggleSameAsProfile(e));
    }

    loadUserInfo() {
        // Sử dụng AJAX để lấy thông tin profile và địa chỉ mặc định
        this.loadProfileInfo();
        this.loadDefaultAddress();
    }

    loadProfileInfo() {
        // Lấy thông tin profile của user
        $.ajax({
            url: '/api/profile',
            type: 'GET',
            beforeSend: function (xhr) {
                const token = $("meta[name='_csrf']").attr("content");
                const header = $("meta[name='_csrf_header']").attr("content");
                if (token && header) {
                    xhr.setRequestHeader(header, token);
                }
            },
            success: (response) => {
                this.prefillProfileInfo(response);
            },
            error: (xhr, status, error) => {
                console.error('Error loading profile info:', error);
            }
        });
    }

    loadDefaultAddress() {
        // Lấy địa chỉ mặc định của user
        $.ajax({
            url: '/api/addresses/default',
            type: 'GET',
            beforeSend: function (xhr) {
                const token = $("meta[name='_csrf']").attr("content");
                const header = $("meta[name='_csrf_header']").attr("content");
                if (token && header) {
                    xhr.setRequestHeader(header, token);
                }
            },
            success: (response) => {
                this.prefillAddressInfo(response);
            },
            error: (xhr, status, error) => {
                console.error('Error loading default address:', error);
                // Fallback: thử lấy danh sách địa chỉ
                this.loadFirstAddress();
            }
        });
    }

    loadFirstAddress() {
        // Fallback: lấy danh sách địa chỉ và chọn cái đầu tiên
        $.ajax({
            url: '/api/addresses',
            type: 'GET',
            beforeSend: function (xhr) {
                const token = $("meta[name='_csrf']").attr("content");
                const header = $("meta[name='_csrf_header']").attr("content");
                if (token && header) {
                    xhr.setRequestHeader(header, token);
                }
            },
            success: (response) => {
                if (response && response.length > 0) {
                    this.prefillAddressInfo(response[0]);
                }
            },
            error: (xhr, status, error) => {
                console.error('Error loading addresses:', error);
            }
        });
    }

    prefillProfileInfo(profile) {
        if (profile) {
            if (profile.fullName) {
                $('#customerName').val(profile.fullName);
            }
            if (profile.email) {
                $('#customerEmail').val(profile.email);
            }
            if (profile.phone) {
                $('#customerPhone').val(profile.phone);
            }
        }
    }

    prefillAddressInfo(address) {
        if (address) {
            const fullAddress = this.buildFullAddress(address);
            if (fullAddress) {
                $('#shippingAddress').val(fullAddress);
            }
        }
    }

    buildFullAddress(address) {
        if (!address) return '';

        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.zipCode) parts.push(address.zipCode);
        if (address.country) parts.push(address.country);

        return parts.join(', ');
    }

    toggleSameAsProfile(e) {
        if (e.target.checked) {
            this.loadUserInfo();
        } else {
            this.clearForm();
        }
    }

    clearForm() {
        $('#customerName').val('');
        $('#customerEmail').val('');
        $('#customerPhone').val('');
        $('#shippingAddress').val('');
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
                success: (response) => {
                    ToastService.success('Đặt hàng thành công!');
                    // Redirect to success page
                    setTimeout(() => {
                        window.location.href = `/orders/success/${response.orderNumber}`;
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