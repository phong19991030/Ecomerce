// src/main/resources/static/js/profile/addresses.js
class AddressesManager {
    constructor() {
        this.token = $("meta[name='_csrf']").attr("content");
        this.header = $("meta[name='_csrf_header']").attr("content");
        this.modal = null;
        this.viewMapModal = null;
        this.editingAddressId = null;
        this.map = null;
        this.viewMap = null;
        this.marker = null;
        this.viewMarker = null;
        this.isMapInitialized = false;
        this.isViewMapInitialized = false;
        this.geocoderControl = null; // Khai báo biến lưu trữ Geocoder Control
        this.init();
    }

    init() {
        this.setupModals();
        this.loadAddresses();
        this.setupEventListeners();
        this.setupDynamicEventListeners();
    }

    setupModals() {
        this.modal = new bootstrap.Modal(document.getElementById('addressModal'));
        this.viewMapModal = new bootstrap.Modal(document.getElementById('viewMapModal'));

        // Khi mở modal địa chỉ
        $('#addressModal').on('shown.bs.modal', () => {
            // Lấy tọa độ hiện tại (hoặc mặc định) để khởi tạo Map
            const lat = parseFloat($('#latitude').val()) || 10.762622; // Mặc định TP.HCM
            const lon = parseFloat($('#longitude').val()) || 106.660172; // Mặc định TP.HCM
            this.initializeMap(lat, lon);
        });

        // Khi mở modal xem bản đồ
        $('#viewMapModal').on('shown.bs.modal', () => {
            this.initializeViewMap();
        });

        // Khi đóng modal
        $('#addressModal').on('hidden.bs.modal', () => {
            this.editingAddressId = null;
            this.resetForm();
            // Đảm bảo xóa map và control khi đóng modal
            if (this.map) {
                // Xóa Geocoder Control khỏi map trước khi xóa map
                if (this.geocoderControl) {
                    this.map.removeControl(this.geocoderControl);
                    this.geocoderControl = null;
                }
                this.map.remove();
                this.isMapInitialized = false;
            }
        });

        $('#viewMapModal').on('hidden.bs.modal', () => {
            if (this.viewMap) {
                this.viewMap.remove();
                this.isViewMapInitialized = false;
            }
        });
    }

    initializeMap(lat = 10.762622, lon = 106.660172) {
        if (!this.isMapInitialized) {
            this.map = L.map('map', {
                center: [lat, lon],
                zoom: 13
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            this.marker = L.marker([lat, lon], {
                draggable: true
            }).addTo(this.map);
            this.isMapInitialized = true;
        } else {
            // Trường hợp map đã khởi tạo (khi chỉnh sửa)
            this.map.setView([lat, lon], 15);
            this.marker.setLatLng([lat, lon]);
        }

        // Luôn gọi invalidateSize khi mở modal
        this.map.invalidateSize();

        // -----------------------------------------------------------
        // 1. KHỞI TẠO VÀ HIỂN THỊ THANH TÌM KIẾM (GEOCODER CONTROL)
        if (!this.geocoderControl) {
            this.geocoderControl = L.Control.geocoder({
                geocoder: L.Control.Geocoder.nominatim(),
                placeholder: 'Tìm kiếm địa chỉ...',
                defaultMarkGeocode: false,
                collapsed: false // BẮT BUỘC: Đảm bảo thanh tìm kiếm luôn mở
            }).on('markgeocode', (e) => {
                const latLng = e.geocode.center;
                const bbox = e.geocode.bbox;

                // Cập nhật marker và zoom/pan bản đồ
                this.marker.setLatLng(latLng);
                this.map.fitBounds(bbox);

                // Gán tọa độ vào các input hidden của form
                $('#latitude').val(latLng.lat.toFixed(6));
                $('#longitude').val(latLng.lng.toFixed(6));

                // FIX: Xử lý gán giá trị địa chỉ chi tiết
                const properties = e.geocode.properties;
                const address = properties.address;

                if (address) {
                    // Cố gắng gán các giá trị chi tiết
                    // 'house_number' + 'road' thường là địa chỉ chi tiết nhất
                    const streetDetail = [address.house_number, address.road].filter(Boolean).join(' ');

                    $('#street').val(streetDetail || address.building || ''); // Địa chỉ chi tiết
                    // Ưu tiên city/town/village cho City (Tỉnh/Thành phố)
                    $('#city').val(address.city || address.town || address.village || address.county || '');
                    // State (Quận/Huyện/Tỉnh) - Cần xem xét cách Nominatim trả về
                    $('#state').val(address.state || address.county || '');
                    $('#country').val(address.country || 'Việt Nam');
                    $('#zipCode').val(address.postcode || '');
                }

                this.showAlert('Vị trí đã được tìm thấy và gán tọa độ, thông tin địa chỉ đã được tự động điền.', 'info');

            }).addTo(this.map);
        }

        // 2. Xử lý sự kiện click trên bản đồ
        this.map.off('click').on('click', (e) => {
            this.marker.setLatLng(e.latlng);
            $('#latitude').val(e.latlng.lat.toFixed(6));
            $('#longitude').val(e.latlng.lng.toFixed(6));
            this.showAlert('Đã chọn vị trí mới trên bản đồ.', 'info');
        });

        // 3. Xử lý sự kiện kéo thả marker
        this.marker.off('dragend').on('dragend', (e) => {
            const latLng = this.marker.getLatLng();
            $('#latitude').val(latLng.lat.toFixed(6));
            $('#longitude').val(latLng.lng.toFixed(6));
            this.showAlert('Đã chọn vị trí mới bằng cách kéo thả marker.', 'info');
        });
        // -----------------------------------------------------------
    }

    initializeViewMap(lat = 10.762622, lon = 106.660172, addressText = "Địa chỉ") {
        if (!this.isViewMapInitialized) {
            this.viewMap = L.map('viewMap').setView([lat, lon], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.viewMap);
            this.isViewMapInitialized = true;
        } else {
            this.viewMap.setView([lat, lon], 15);
        }

        // Xóa marker cũ nếu có
        if (this.viewMarker) {
            this.viewMarker.remove();
        }

        // Thêm marker mới
        this.viewMarker = L.marker([lat, lon]).addTo(this.viewMap)
            .bindPopup(`<b>${addressText}</b>`).openPopup();

        this.viewMap.invalidateSize();
    }

    setupEventListeners() {
        // Event listener cho nút "Thêm địa chỉ mới"
        $('#addAddressBtn').on('click', () => {
            $('#addressModalLabel').text('Thêm Địa chỉ mới');
            this.resetForm();
            this.modal.show();
        });

        // Event listener cho nút "Lưu địa chỉ"
        $('#saveAddressBtn').on('click', () => this.saveAddress());
    }

    setupDynamicEventListeners() {
        // Event delegation cho các nút Chỉnh sửa/Xóa/Mặc định/Xem Bản đồ
        $('#addressesContainer').on('click', '.edit-address-btn', (e) => {
            const id = $(e.currentTarget).data('id');
            $('#addressModalLabel').text('Chỉnh sửa Địa chỉ');
            this.populateForm(id);
            this.modal.show();
        });

        $('#addressesContainer').on('click', '.delete-address-btn', (e) => {
            const id = $(e.currentTarget).data('id');
            this.deleteAddress(id);
        });

        $('#addressesContainer').on('click', '.default-address-btn', (e) => {
            const id = $(e.currentTarget).data('id');
            this.setDefaultAddress(id);
        });

        $('#addressesContainer').on('click', '.view-map-btn', (e) => {
            const card = $(e.currentTarget).closest('.address-card');
            const lat = card.data('lat');
            const lon = card.data('lon');
            const fullAddress = card.data('full-address');

            if (lat && lon) {
                this.initializeViewMap(lat, lon, fullAddress);
                this.viewMapModal.show();
            } else {
                this.showAlert('Địa chỉ này chưa có tọa độ (Latitude/Longitude) được lưu.', 'warning');
            }
        });
    }

    async loadAddresses() {
        try {
            const response = await fetch('/api/addresses');
            if (response.ok) {
                const addresses = await response.json();
                this.renderAddresses(addresses);
            } else {
                this.showAlert('Không thể tải danh sách địa chỉ.', 'danger');
            }
        } catch (error) {
            this.showAlert('Lỗi khi tải địa chỉ: ' + error.message, 'danger');
        }
    }

    async populateForm(id) {
        try {
            const response = await fetch(`/api/addresses/${id}`);
            if (response.ok) {
                const address = await response.json();
                this.editingAddressId = id;

                // Điền dữ liệu vào form
                $('#addressId').val(address.id);
                $('#fullName').val(address.fullName);
                $('#phone').val(address.phone);
                $('#street').val(address.street);
                $('#city').val(address.city);
                $('#state').val(address.state);
                $('#zipCode').val(address.zipCode);
                $('#country').val(address.country);
                $('#isDefault').prop('checked', address.default);
                $('#addressType').val(address.addressType);

                // Điền tọa độ (FIX YÊU CẦU 3: truy cập vào vị trí đã lưu)
                const lat = address.latitude ? parseFloat(address.latitude) : 10.762622;
                const lon = address.longitude ? parseFloat(address.longitude) : 106.660172;
                $('#latitude').val(address.latitude);
                $('#longitude').val(address.longitude);

                // Khởi tạo/cập nhật bản đồ với tọa độ địa chỉ
                this.initializeMap(lat, lon);

            } else {
                this.showAlert('Không tìm thấy địa chỉ.', 'danger');
            }
        } catch (error) {
            this.showAlert('Lỗi khi tải dữ liệu địa chỉ: ' + error.message, 'danger');
        }
    }

    renderAddresses(addresses) {
        const container = $('#addressesContainer');
        container.empty();

        if (addresses.length === 0) {
            container.append('<p class="text-center w-100">Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>');
            return;
        }

        addresses.forEach(address => {
            const isDefault = address.default;
            const cardClass = isDefault ? 'border-primary shadow-lg' : '';
            const typeBadge = address.addressType === 'HOME' ? 'secondary' : (address.addressType === 'WORK' ? 'info' : 'warning');
            const fullAddress = `${address.street}, ${address.state}, ${address.city}, ${address.country}`;
            const addressCard = `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 address-card ${cardClass}" 
                         data-lat="${address.latitude || ''}" 
                         data-lon="${address.longitude || ''}"
                         data-full-address="${fullAddress}">
                        <div class="card-body position-relative">
                            ${isDefault ? '<span class="badge bg-primary default-badge"><i class="fas fa-check-circle"></i> Mặc định</span>' : ''}
                            <span class="badge bg-${typeBadge} mb-2">${address.addressType === 'HOME' ? 'Nhà Riêng' : (address.addressType === 'WORK' ? 'Công Ty' : 'Khác')}</span>
                            <h5 class="card-title">${address.fullName}</h5>
                            <p class="card-text mb-1"><i class="fas fa-phone-alt me-2 text-muted"></i> ${address.phone}</p>
                            <p class="card-text"><i class="fas fa-map-marker-alt me-2 text-muted"></i> ${fullAddress}</p>
                            
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-secondary edit-address-btn" data-id="${address.id}">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-address-btn" data-id="${address.id}">
                                    <i class="fas fa-trash-alt"></i> Xóa
                                </button>
                                <button class="btn btn-sm btn-outline-success view-map-btn" data-id="${address.id}">
                                    <i class="fas fa-globe"></i> Bản đồ
                                </button>
                                ${!isDefault ? `
                                    <button class="btn btn-sm btn-outline-primary default-address-btn" data-id="${address.id}">
                                        <i class="fas fa-star"></i> Mặc định
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(addressCard);
        });
    }

    async saveAddress() {
        const form = $('#addressForm');
        // Kiểm tra validation cơ bản
        if (!form[0].checkValidity()) {
            form.addClass('was-validated');
            return;
        }

        // Kiểm tra tọa độ đã được chọn chưa
        if (!$('#latitude').val() || !$('#longitude').val()) {
            this.showAlert('Vui lòng chọn vị trí trên bản đồ hoặc sử dụng thanh tìm kiếm.', 'warning');
            return;
        }

        const url = this.editingAddressId ? `/api/addresses/${this.editingAddressId}` : '/api/addresses';
        const method = this.editingAddressId ? 'PUT' : 'POST';
        const data = {};
        form.serializeArray().forEach(item => {
            // Chuyển giá trị mặc định từ 'on' sang true/false
            if (item.name === 'default') {
                data['default'] = true;
            } else {
                data[item.name] = item.value;
            }
        });
        // Đảm bảo default là false nếu checkbox không được chọn
        if (!data.hasOwnProperty('default')) {
            data['default'] = false;
        }

        // Đảm bảo latitude và longitude là kiểu số (double/float)
        data.latitude = parseFloat(data.latitude);
        data.longitude = parseFloat(data.longitude);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    [this.header]: this.token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const message = this.editingAddressId ? 'Đã cập nhật địa chỉ thành công!' : 'Đã thêm địa chỉ mới thành công!';
                this.showAlert(message, 'success');
                this.modal.hide();
                this.loadAddresses();
            } else {
                const error = await response.json();
                this.showAlert('Lỗi khi lưu địa chỉ: ' + (error.message || response.statusText), 'danger');
            }
        } catch (error) {
            this.showAlert('Lỗi kết nối khi lưu địa chỉ: ' + error.message, 'danger');
        }
    }

    async setDefaultAddress(id) {
        if (confirm('Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định không?')) {
            try {
                // SỬA: Thay đổi URL để khớp với API POST /api/addresses/{id}/set-default
                const response = await fetch(`/api/addresses/${id}/set-default`, {
                    method: 'POST', // SỬA: Dùng POST thay vì PUT
                    headers: {
                        [this.header]: this.token // Gửi token CSRF
                    }
                    // KHÔNG cần body
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.showAlert('Đã đặt địa chỉ mặc định thành công!', 'success');
                        this.loadAddresses(); // Tải lại danh sách để cập nhật giao diện
                    } else {
                        // Xử lý lỗi từ server (ví dụ: "Address not found")
                        this.showAlert(result.message, 'danger');
                    }
                } else {
                    // Xử lý lỗi HTTP khác (ví dụ: 404, 500)
                    this.showAlert('Lỗi khi đặt địa chỉ mặc định. Mã lỗi: ' + response.status, 'danger');
                }
            } catch (error) {
                this.showAlert('Lỗi kết nối khi đặt địa chỉ mặc định: ' + error.message, 'danger');
            }
        }
    }
    async deleteAddress(id) {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) {
            try {
                const response = await fetch(`/api/addresses/${id}`, {
                    method: 'DELETE',
                    headers: {
                        [this.header]: this.token
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.showAlert('Đã xóa địa chỉ thành công!', 'success');
                        this.loadAddresses();
                    } else {
                        this.showAlert(result.message, 'danger');
                    }
                } else {
                    this.showAlert('Lỗi khi xóa địa chỉ.', 'danger');
                }
            } catch (error) {
                this.showAlert('Lỗi khi xóa địa chỉ: ' + error.message, 'danger');
            }
        }
    }

    resetForm() {
        $('#addressForm')[0].reset();
        $('#country').val('Việt Nam');
        $('#latitude').val('');
        $('#longitude').val('');
    }

    showAlert(message, type) {
        // Remove existing alerts
        $('.alert').alert('close');

        // Create new alert
        const alert = $(`
            <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $('main .container').prepend(alert);

        // Auto close after 5 seconds
        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }
}

// Initialize when document is ready
$(document).ready(function() {
    new AddressesManager();
});