// src/main/resources/static/js/toast-service.js
class ToastService {
    static showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');

        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas ${this.getIcon(type)} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });

        toast.show();

        // Remove toast from DOM after it hides
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    static getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    static success(message) {
        this.showToast(message, 'success');
    }

    static error(message) {
        this.showToast(message, 'error');
    }

    static warning(message) {
        this.showToast(message, 'warning');
    }

    static info(message) {
        this.showToast(message, 'info');
    }



}
