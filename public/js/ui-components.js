// ===== Toast Notification System =====

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Animate in
        setTimeout(() => toast.classList.add('toast-show'), 10);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    }

    hide(toast) {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            toast.remove();
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    clearAll() {
        this.toasts.forEach(toast => this.hide(toast));
    }
}

// Create global toast instance
const toast = new ToastManager();

// ===== Loading Spinner =====

const LoadingSpinner = {
    show(message = 'جاري التحميل...') {
        // Remove existing spinner if any
        this.hide();

        const spinner = document.createElement('div');
        spinner.className = 'loading-overlay';
        spinner.id = 'global-loading-spinner';
        spinner.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(spinner);
        setTimeout(() => spinner.classList.add('show'), 10);
    },

    hide() {
        const spinner = document.getElementById('global-loading-spinner');
        if (spinner) {
            spinner.classList.remove('show');
            setTimeout(() => spinner.remove(), 300);
        }
    }
};

// ===== Confirmation Dialog =====

const ConfirmDialog = {
    show(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'تأكيد',
                message = 'هل أنت متأكد من هذا الإجراء؟',
                confirmText = 'تأكيد',
                cancelText = 'إلغاء',
                type = 'warning' // success, error, warning, info
            } = options;

            // Remove existing dialog if any
            const existing = document.getElementById('confirm-dialog');
            if (existing) existing.remove();

            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog-overlay';
            dialog.id = 'confirm-dialog';

            const icon = this.getIcon(type);
            dialog.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-dialog-icon confirm-dialog-icon-${type}">
                        <i class="${icon}"></i>
                    </div>
                    <h3 class="confirm-dialog-title">${title}</h3>
                    <p class="confirm-dialog-message">${message}</p>
                    <div class="confirm-dialog-actions">
                        <button class="btn btn-secondary" id="confirm-cancel">
                            ${cancelText}
                        </button>
                        <button class="btn btn-${type === 'error' ? 'danger' : 'primary'}" id="confirm-ok">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);
            setTimeout(() => dialog.classList.add('show'), 10);

            // Event handlers
            const handleConfirm = () => {
                this.hide();
                resolve(true);
            };

            const handleCancel = () => {
                this.hide();
                resolve(false);
            };

            document.getElementById('confirm-ok').addEventListener('click', handleConfirm);
            document.getElementById('confirm-cancel').addEventListener('click', handleCancel);

            // Close on overlay click
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) handleCancel();
            });

            // Close on Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    handleCancel();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    },

    hide() {
        const dialog = document.getElementById('confirm-dialog');
        if (dialog) {
            dialog.classList.remove('show');
            setTimeout(() => dialog.remove(), 300);
        }
    },

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.warning;
    }
};

// Helper function for common delete confirmation
async function confirmDelete(itemName = 'هذا العنصر') {
    return await ConfirmDialog.show({
        title: 'تأكيد الحذف',
        message: `هل أنت متأكد من حذف ${itemName}؟ لا يمكن التراجع عن هذا الإجراء.`,
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'error'
    });
}
