// ===== Filter & Pagination Utilities =====

/**
 * FilterManager - Manages filter state, URL sync, and local storage
 */
class FilterManager {
    constructor(storageKey = 'reportFilters') {
        this.storageKey = storageKey;
        this.filters = this.loadFromStorage() || this.getDefaultFilters();
        this.debounceTimers = {};
    }

    /**
     * Get default filter values
     */
    getDefaultFilters() {
        return {
            search: '',
            branchId: null,
            startDate: null,
            endDate: null,
            isMatching: null,
            sortBy: 'created_at',
            sortOrder: 'desc',
            page: 1,
            limit: 25
        };
    }

    /**
     * Update a single filter value
     * @param {string} key - Filter key
     * @param {any} value - Filter value
     */
    setFilter(key, value) {
        this.filters[key] = value;

        // Reset to page 1 when filters change (except page/limit changes)
        if (key !== 'page' && key !== 'limit') {
            this.filters.page = 1;
        }

        this.saveToStorage();
        return this.filters;
    }

    /**
     * Update multiple filters at once
     * @param {Object} newFilters - Object with filter key-value pairs
     */
    setFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        if (!newFilters.page && !newFilters.limit) {
            this.filters.page = 1;
        }
        this.saveToStorage();
        return this.filters;
    }

    /**
     * Get current filter value
     * @param {string} key - Filter key
     */
    getFilter(key) {
        return this.filters[key];
    }

    /**
     * Get all filters
     */
    getAllFilters() {
        return { ...this.filters };
    }

    /**
     * Reset all filters to defaults
     */
    resetFilters() {
        this.filters = this.getDefaultFilters();
        this.saveToStorage();
        this.syncToURL();
        return this.filters;
    }

    /**
     * Save filters to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.filters));
        } catch (e) {
            console.warn('Failed to save filters to localStorage:', e);
        }
    }

    /**
     * Load filters from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn('Failed to load filters from localStorage:', e);
            return null;
        }
    }

    /**
     * Sync filters to URL query parameters
     */
    syncToURL() {
        const params = new URLSearchParams();

        Object.entries(this.filters).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                params.set(key, value);
            }
        });

        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    }

    /**
     * Load filters from URL query parameters
     */
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const urlFilters = {};

        params.forEach((value, key) => {
            // Convert numeric values
            if (key === 'branchId' || key === 'page' || key === 'limit' || key === 'isMatching') {
                urlFilters[key] = value ? parseInt(value) : null;
            } else {
                urlFilters[key] = value;
            }
        });

        if (Object.keys(urlFilters).length > 0) {
            this.filters = { ...this.getDefaultFilters(), ...urlFilters };
            this.saveToStorage();
        }

        return this.filters;
    }

    /**
     * Debounce a callback function
     * @param {string} key - Unique key for the debounce timer
     * @param {Function} callback - Function to debounce
     * @param {number} delay - Delay in milliseconds
     */
    debounce(key, callback, delay = 300) {
        if (this.debounceTimers[key]) {
            clearTimeout(this.debounceTimers[key]);
        }

        this.debounceTimers[key] = setTimeout(() => {
            callback();
            delete this.debounceTimers[key];
        }, delay);
    }

    /**
     * Build query string from current filters
     * @returns {string} Query string for API requests
     */
    toQueryString() {
        const params = new URLSearchParams();

        Object.entries(this.filters).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                params.set(key, value);
            }
        });

        return params.toString();
    }

    /**
     * Get clean filters (removing null/empty values)
     * @returns {Object} Clean filter object
     */
    getCleanFilters() {
        const clean = {};
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                clean[key] = value;
            }
        });
        return clean;
    }
}

/**
 * PaginationHelper - Utility for pagination calculations and rendering
 */
class PaginationHelper {
    constructor(total, page, limit) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
    }

    /**
     * Check if there is a next page
     */
    hasNext() {
        return this.page < this.totalPages;
    }

    /**
     * Check if there is a previous page
     */
    hasPrev() {
        return this.page > 1;
    }

    /**
     * Get start index for current page (1-based)
     */
    getStartIndex() {
        return (this.page - 1) * this.limit + 1;
    }

    /**
     * Get end index for current page (1-based)
     */
    getEndIndex() {
        return Math.min(this.page * this.limit, this.total);
    }

    /**
     * Get page numbers to display (with ellipsis logic)
     * @param {number} maxVisible - Maximum number of page buttons to show
     * @returns {Array} Array of page numbers or 'ellipsis'
     */
    getPageNumbers(maxVisible = 7) {
        const pages = [];

        if (this.totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            // Calculate range around current page
            const start = Math.max(2, this.page - 1);
            const end = Math.min(this.totalPages - 1, this.page + 1);

            // Add ellipsis if needed
            if (start > 2) {
                pages.push('ellipsis');
            }

            // Add pages around current
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (end < this.totalPages - 1) {
                pages.push('ellipsis');
            }

            // Show last page
            if (this.totalPages > 1) {
                pages.push(this.totalPages);
            }
        }

        return pages;
    }

    /**
     * Generate result count text in Arabic
     * @returns {string} e.g., "عرض 1-25 من 156"
     */
    getResultText() {
        if (this.total === 0) {
            return 'لا توجد نتائج';
        }
        return `عرض ${this.getStartIndex()}-${this.getEndIndex()} من ${this.total}`;
    }
}

/**
 * Create pagination controls HTML
 * @param {PaginationHelper} pagination - Pagination helper instance
 * @param {Function} onPageChange - Callback when page changes
 * @returns {HTMLElement} Pagination control element
 */
function createPaginationControls(pagination, onPageChange) {
    const container = document.createElement('div');
    container.className = 'pagination-controls';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i> السابق';
    prevBtn.disabled = !pagination.hasPrev();
    prevBtn.onclick = () => onPageChange(pagination.page - 1);
    container.appendChild(prevBtn);

    // Page numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';

    pagination.getPageNumbers().forEach(pageNum => {
        if (pageNum === 'ellipsis') {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${pageNum === pagination.page ? 'active' : ''}`;
            pageBtn.textContent = pageNum;
            pageBtn.onclick = () => onPageChange(pageNum);
            pageNumbers.appendChild(pageBtn);
        }
    });

    container.appendChild(pageNumbers);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = 'التالي <i class="fas fa-chevron-left"></i>';
    nextBtn.disabled = !pagination.hasNext();
    nextBtn.onclick = () => onPageChange(pagination.page + 1);
    container.appendChild(nextBtn);

    // Result count
    const resultText = document.createElement('div');
    resultText.className = 'result-count';
    resultText.textContent = pagination.getResultText();
    container.appendChild(resultText);

    return container;
}

/**
 * Apply sorting to table headers
 * @param {string} tableId - Table element ID
 * @param {FilterManager} filterManager - Filter manager instance
 * @param {Function} onSort - Callback when sort changes
 */
function initSortableHeaders(tableId, filterManager, onSort) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('thead th[data-sortable]');

    headers.forEach(header => {
        const column = header.getAttribute('data-sortable');
        header.style.cursor = 'pointer';
        header.classList.add('sortable-header');

        // Add sort indicator
        const indicator = document.createElement('i');
        indicator.className = 'fas fa-sort sort-indicator';
        header.appendChild(indicator);

        header.onclick = () => {
            const currentSort = filterManager.getFilter('sortBy');
            const currentOrder = filterManager.getFilter('sortOrder');

            let newOrder = 'desc';
            if (currentSort === column && currentOrder === 'desc') {
                newOrder = 'asc';
            }

            filterManager.setFilters({ sortBy: column, sortOrder: newOrder });
            updateSortIndicators(table, column, newOrder);
            onSort(column, newOrder);
        };
    });

    // Update initial indicators
    const currentSort = filterManager.getFilter('sortBy');
    const currentOrder = filterManager.getFilter('sortOrder');
    updateSortIndicators(table, currentSort, currentOrder);
}

/**
 * Update sort indicator icons
 */
function updateSortIndicators(table, activeColumn, order) {
    const headers = table.querySelectorAll('thead th[data-sortable]');
    headers.forEach(header => {
        const indicator = header.querySelector('.sort-indicator');
        const column = header.getAttribute('data-sortable');

        if (column === activeColumn) {
            indicator.className = `fas fa-sort-${order === 'asc' ? 'up' : 'down'} sort-indicator active`;
        } else {
            indicator.className = 'fas fa-sort sort-indicator';
        }
    });
}

// Make classes globally available
window.FilterManager = FilterManager;
window.PaginationHelper = PaginationHelper;
window.createPaginationControls = createPaginationControls;
window.initSortableHeaders = initSortableHeaders;
