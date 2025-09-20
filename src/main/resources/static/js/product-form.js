// src/main/resources/static/js/product-form.js
$(document).ready(function() {
    const productId = $('#productId').val();
    const isEdit = !!productId;

    // Load categories
    loadCategories();

    // Nếu là edit mode, load product data
    if (isEdit) {
        loadProductData(productId);
    }

    // Handle form submission
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        if (isEdit) {
            updateProduct(productId);
        } else {
            createProduct();
        }
    });

    // Handle image file change
    $('#imageFile').on('change', function() {
        const file = this.files[0];
        if (file) {
            // Preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#currentImage').attr('src', e.target.result);
                $('#currentImageContainer').removeClass('d-none');
            }
            reader.readAsDataURL(file);
        }
    });
});

function loadCategories() {
    $.ajax({
        url: '/api/public/categories/find_all',
        type: 'GET',
        success: function(categories) {
            const categorySelect = $('#categoryId');
            categorySelect.empty().append('<option value="">Lựa chọn sản phẩm</option>');

            categories.forEach(category => {
                categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
            });
        },
        error: function(xhr) {
            console.error('Failed to load categories:', xhr.responseJSON?.error);
            // Vẫn hiển thị dropdown nhưng không có categories
            $('#categoryId').empty().append('<option value="">Lựa chọn sản phẩm</option>');
        }
    });
}

function loadProductData(productId) {
    $.ajax({
        url: `/admin/api/products/${productId}`,
        type: 'GET',
        success: function(product) {
            // Fill form fields
            $('#name').val(product.name || '');
            $('#description').val(product.description || '');
            $('#price').val(product.price || 0);
            $('#stock').val(product.stock || 0);
            $('#sku').val(product.sku || '');
            $('#brand').val(product.brand || '');
            $('#color').val(product.color || '');
            $('#active').prop('checked', product.active !== false);

            // Xử lý category - hỗ trợ cả DTO và Entity format
            let categoryId = null;
            if (product.category) {
                if (typeof product.category === 'object') {
                    categoryId = product.category.id;
                } else if (typeof product.category === 'number') {
                    categoryId = product.category;
                }
            }

            if (categoryId) {
                $('#categoryId').val(categoryId);
            }

            // Show current image if exists
            if (product.imageUrl) {
                $('#currentImage').attr('src', product.imageUrl);
                $('#currentImageContainer').removeClass('d-none');
            }
        },
        error: function(xhr) {
            console.error('Failed to load product:', xhr);
            ToastService.error('Failed to load product data: ' + (xhr.responseJSON?.error || 'Unknown error'));
            setTimeout(() => {
                window.location.href = '/admin/products';
            }, 2000);
        }
    });
}

function createProduct() {
    const formData = new FormData();

    // Thêm các field từ form - tên phải khớp với ProductRequestDTO
    formData.append('name', $('#name').val());
    formData.append('description', $('#description').val());
    formData.append('price', $('#price').val());
    formData.append('stock', $('#stock').val());
    formData.append('sku', $('#sku').val());
    formData.append('brand', $('#brand').val());
    formData.append('color', $('#color').val());
    formData.append('active', $('#active').is(':checked'));

    const categoryId = $('#categoryId').val();
    if (categoryId) {
        formData.append('categoryId', categoryId);
    }

    const imageFile = $('#imageFile')[0].files[0];
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }

    $.ajax({
        url: '/admin/api/products',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function(xhr) {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");
            if (token && header) {
                xhr.setRequestHeader(header, token);
            }
        },
        success: function() {
            ToastService.success('Product created successfully!');
            setTimeout(() => {
                window.location.href = '/admin/products';
            }, 1500);
        },
        error: function(xhr) {
            ToastService.error('Failed to create product: ' + (xhr.responseJSON?.error || 'Unknown error'));
        }
    });
}

function updateProduct(productId) {
    const formData = new FormData();

    formData.append('name', $('#name').val());
    formData.append('description', $('#description').val());
    formData.append('price', $('#price').val());
    formData.append('stock', $('#stock').val());
    formData.append('sku', $('#sku').val());
    formData.append('brand', $('#brand').val());
    formData.append('color', $('#color').val());
    formData.append('active', $('#active').is(':checked'));

    const categoryId = $('#categoryId').val();
    if (categoryId) {
        formData.append('categoryId', categoryId);
    } else {
        // Gửi null để xóa category
        formData.append('categoryId', '');
    }

    const imageFile = $('#imageFile')[0].files[0];
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }

    $.ajax({
        url: `/admin/api/products/${productId}`,
        type: 'PUT',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function(xhr) {
            const token = $("meta[name='_csrf']").attr("content");
            const header = $("meta[name='_csrf_header']").attr("content");
            if (token && header) {
                xhr.setRequestHeader(header, token);
            }
        },
        success: function() {
            ToastService.success('Product updated successfully!');
            setTimeout(() => {
                window.location.href = '/admin/products';
            }, 1500);
        },
        error: function(xhr) {
            ToastService.error('Failed to update product: ' + (xhr.responseJSON?.error || 'Unknown error'));
        }
    });
}
