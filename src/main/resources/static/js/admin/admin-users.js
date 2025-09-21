// src/main/resources/static/js/admin-users.js
$(document).ready(function() {
    let currentPage = 0;
    let currentSearch = '';
    let currentStatus = '';
    let deleteUserId = null;

    // Initialize
    loadUsers();

    // Event listeners
    $('#searchBtn').click(function() {
        currentSearch = $('#searchInput').val();
        currentPage = 0;
        loadUsers();
    });

    $('#searchInput').keypress(function(e) {
        if (e.which === 13) {
            currentSearch = $(this).val();
            currentPage = 0;
            loadUsers();
        }
    });

    $('#statusFilter').change(function() {
        currentStatus = $(this).val();
        currentPage = 0;
        loadUsers();
    });

    $('#saveUserBtn').click(saveUser);
    $('#confirmDeleteBtn').click(confirmDelete);

    // Functions
    function loadUsers() {
        let url = `/admin/users/api?page=${currentPage}&size=10`;
        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }
        if (currentStatus) {
            url += `&enabled=${currentStatus}`;
        }

        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function(xhr) {
                const csrf = getCsrfToken();
                if (csrf.token && csrf.header) {
                    xhr.setRequestHeader(csrf.header, csrf.token);
                }
            },
            success: function(response) {
                renderUsersTable(response.users);
                renderPagination(response);
            },
            error: function(xhr) {
                showAlert('Lỗi khi tải dữ liệu người dùng', 'danger');
            }
        });
    }

    function renderUsersTable(users) {
        const tbody = $('#usersTable tbody');
        tbody.empty();

        if (users.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="7" class="text-center">Không có người dùng nào</td>
                </tr>
            `);
            return;
        }

        users.forEach(user => {
            const statusBadge = user.enabled ?
                '<span class="badge bg-success">Hoạt động</span>' :
                '<span class="badge bg-danger">Vô hiệu hóa</span>';

            const roles = user.roles ? Array.from(user.roles).join(', ') : '';

            tbody.append(`
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.fullName || '-'}</td>
                    <td>${roles}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning status-btn" data-id="${user.id}">
                            <i class="fas ${user.enabled ? 'fa-ban' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });

        // Attach event listeners to buttons
        $('.edit-btn').click(function() {
            const userId = $(this).data('id');
            editUser(userId);
        });

        $('.status-btn').click(function() {
            const userId = $(this).data('id');
            toggleUserStatus(userId);
        });

        $('.delete-btn').click(function() {
            const userId = $(this).data('id');
            showDeleteModal(userId);
        });
    }

    function renderPagination(response) {
        const pagination = $('#pagination');
        pagination.empty();

        if (response.totalPages <= 1) return;

        // Previous button
        pagination.append(`
            <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Trước</a>
            </li>
        `);

        // Page numbers
        for (let i = 0; i < response.totalPages; i++) {
            pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                </li>
            `);
        }

        // Next button
        pagination.append(`
            <li class="page-item ${currentPage === response.totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Sau</a>
            </li>
        `);

        $('.page-link').click(function(e) {
            e.preventDefault();
            currentPage = parseInt($(this).data('page'));
            loadUsers();
        });
    }

    function editUser(userId) {
        $.ajax({
            url: `/admin/users/api/${userId}`,
            type: 'GET',
            beforeSend: function(xhr) {
                const csrf = getCsrfToken();
                if (csrf.token && csrf.header) {
                    xhr.setRequestHeader(csrf.header, csrf.token);
                }
            },
            success: function(user) {
                $('#modalTitle').text('Chỉnh sửa người dùng');
                $('#userId').val(user.id);
                $('#username').val(user.username);
                $('#email').val(user.email);
                $('#fullName').val(user.fullName || '');
                $('#enabled').prop('checked', user.enabled);

                // Hide password field for edit
                $('#passwordField').hide();
                $('#password').removeAttr('required');

                // Clear and set roles
                $('.role-checkbox').prop('checked', false);
                if (user.roleIds) {
                    user.roleIds.forEach(roleId => {
                        $(`#role_${roleId}`).prop('checked', true);
                    });
                }

                $('#userModal').modal('show');
            },
            error: function() {
                showAlert('Lỗi khi tải thông tin người dùng', 'danger');
            }
        });
    }

    function saveUser() {
        const formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            fullName: $('#fullName').val(),
            enabled: $('#enabled').is(':checked'),
            roleIds: Array.from($('.role-checkbox:checked')).map(cb => parseInt(cb.value))
        };

        const userId = $('#userId').val();
        const url = userId ? `/admin/users/api/${userId}` : '/admin/users/api';
        const method = userId ? 'PUT' : 'POST';

        // Add password for new users
        if (!userId) {
            formData.password = $('#password').val();
        }

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(formData),
            beforeSend: function(xhr) {
                const csrf = getCsrfToken();
                if (csrf.token && csrf.header) {
                    xhr.setRequestHeader(csrf.header, csrf.token);
                }
            },
            success: function() {
                $('#userModal').modal('hide');
                showAlert('Lưu người dùng thành công', 'success');
                loadUsers();
                resetForm();
            },
            error: function(xhr) {
                const response = xhr.responseJSON;
                if (response && response.error) {
                    showAlert(response.error, 'danger');
                } else {
                    showAlert('Lỗi khi lưu người dùng', 'danger');
                }
            }
        });
    }

    function toggleUserStatus(userId) {
        $.ajax({
            url: `/admin/users/api/${userId}/toggle-status`,
            type: 'POST',
            beforeSend: function(xhr) {
                const csrf = getCsrfToken();
                if (csrf.token && csrf.header) {
                    xhr.setRequestHeader(csrf.header, csrf.token);
                }
            },
            success: function() {
                showAlert('Cập nhật trạng thái thành công', 'success');
                loadUsers();
            },
            error: function() {
                showAlert('Lỗi khi cập nhật trạng thái', 'danger');
            }
        });
    }

    function showDeleteModal(userId) {
        deleteUserId = userId;
        $('#deleteModal').modal('show');
    }

    function confirmDelete() {
        if (!deleteUserId) return;

        $.ajax({
            url: `/admin/users/api/${deleteUserId}`,
            type: 'DELETE',
            beforeSend: function(xhr) {
                const csrf = getCsrfToken();
                if (csrf.token && csrf.header) {
                    xhr.setRequestHeader(csrf.header, csrf.token);
                }
            },
            success: function() {
                $('#deleteModal').modal('hide');
                showAlert('Xóa người dùng thành công', 'success');
                loadUsers();
                deleteUserId = null;
            },
            error: function() {
                showAlert('Lỗi khi xóa người dùng', 'danger');
                deleteUserId = null;
            }
        });
    }

    function getCsrfToken() {
        const token = $('meta[name="_csrf"]').attr('content');
        const header = $('meta[name="_csrf_header"]').attr('content');
        return { token, header };
    }

    function resetForm() {
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('.role-checkbox').prop('checked', false);
        $('#passwordField').show();
        $('#password').attr('required', 'required');
        $('#modalTitle').text('Thêm người dùng');
    }

    function showAlert(message, type) {
        const alert = $(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $('.card-body').prepend(alert);

        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }

    // Modal event handlers
    $('#userModal').on('hidden.bs.modal', function() {
        resetForm();
    });

    $('#userModal').on('show.bs.modal', function() {
        $('.invalid-feedback').hide();
        $('.form-control').removeClass('is-invalid');
    });
});