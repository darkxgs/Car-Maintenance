// ===== API-Based Database Manager with JWT Auth =====
// Replaces IndexedDB with Neon PostgreSQL via API routes

class DatabaseManager {
    constructor() {
        this.baseUrl = '/api';
    }

    /**
      * Helper to create headers with JWT token
      */
    getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = auth.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Helper to check for 401 and redirect to login
     */
    async handleResponse(response) {
        if (response.status === 401) {
            auth.logout();
            throw new Error('Session expired - please login again');
        }
        return response;
    }

    async init() {
        // No initialization needed for API-based approach
        return Promise.resolve();
    }

    async seedData() {
        // Seeding handled by backend
        return Promise.resolve();
    }

    // Generic CRUD Operations
    async add(storeName, data) {
        const response = await fetch(`${this.baseUrl}/${storeName}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add record');
        }

        const result = await response.json();
        return result.id;
    }

    async update(storeName, data) {
        const response = await fetch(`${this.baseUrl}/${storeName}/${data.id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update record');
        }

        const result = await response.json();
        return result.id;
    }

    async delete(storeName, id) {
        const response = await fetch(`${this.baseUrl}/${storeName}/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete record');
        }

        return true;
    }

    async get(storeName, id) {
        const response = await fetch(`${this.baseUrl}/${storeName}/${id}`, {
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            if (response.status === 404) return null;
            const error = await response.json();
            throw new Error(error.error || 'Failed to get record');
        }

        return await response.json();
    }

    async getAll(storeName) {
        const response = await fetch(`${this.baseUrl}/${storeName}`, {
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get records');
        }

        return await response.json();
    }

    async getByIndex(storeName, indexName, value) {
        const all = await this.getAll(storeName);
        return all.filter(item => item[indexName] === value);
    }

    async getOneByIndex(storeName, indexName, value) {
        const all = await this.getAll(storeName);
        return all.find(item => item[indexName] === value);
    }

    async count(storeName) {
        const all = await this.getAll(storeName);
        return all.length;
    }

    // Car-specific queries
    async findCar(brand, model, year, engineSize) {
        const response = await fetch(
            `${this.baseUrl}/cars/search?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${year}&engineSize=${encodeURIComponent(engineSize)}`,
            { headers: this.getAuthHeaders() }
        );

        await this.handleResponse(response);

        if (!response.ok) {
            if (response.status === 404) return null;
            const error = await response.json();
            throw new Error(error.error || 'Car not found');
        }

        return await response.json();
    }

    async getCarBrands() {
        const response = await fetch(`${this.baseUrl}/cars/brands`, {
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get brands');
        }

        return await response.json();
    }

    async getModelsByBrand(brand) {
        const response = await fetch(`${this.baseUrl}/cars/models?brand=${encodeURIComponent(brand)}`, {
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get models');
        }

        return await response.json();
    }

    async getEngineSizesByModel(brand, model) {
        const response = await fetch(
            `${this.baseUrl}/cars/engines?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`,
            { headers: this.getAuthHeaders() }
        );

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get engine sizes');
        }

        return await response.json();
    }

    async getYearRange(brand, model, engineSize) {
        const cars = await this.getAll('cars');
        const filtered = cars.filter(car =>
            car.brand.toLowerCase() === brand.toLowerCase() &&
            car.model.toLowerCase() === model.toLowerCase() &&
            car.engine_size.toLowerCase() === engineSize.toLowerCase()
        );

        if (filtered.length > 0) {
            return {
                from: Math.min(...filtered.map(c => c.year_from)),
                to: Math.max(...filtered.map(c => c.year_to))
            };
        }
        return null;
    }

    // Operations queries
    async getOperationsByBranch(branchId) {
        return await this.getByIndex('operations', 'branch_id', branchId);
    }

    async getOperationsByDateRange(startDate, endDate) {
        const operations = await this.getAll('operations');
        return operations.filter(op => {
            const opDate = new Date(op.created_at);
            return opDate >= new Date(startDate) && opDate <= new Date(endDate);
        });
    }

    async getMismatchedOperations() {
        return await this.getByIndex('operations', 'is_matching', 0);
    }

    // Reports
    async getReportStats(branchId = null, startDate = null, endDate = null) {
        let url = `${this.baseUrl}/reports/stats?`;
        const params = [];

        if (branchId) params.push(`branchId=${branchId}`);
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);

        url += params.join('&');

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get report stats');
        }

        return await response.json();
    }

    async getCarCountByBranch() {
        const stats = await this.getReportStats();
        return stats.branchCounts;
    }

    /**
     * Helper method to fetch any API endpoint with authentication
     * @param {string} url - API endpoint URL
     * @param {object} options - Fetch options
     * @returns {Promise} Response data
     */
    async fetchWithAuth(url, options = {}) {
        const headers = this.getAuthHeaders();

        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        });

        await this.handleResponse(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }

        return await response.json();
    }

    /**
     * Get paginated operations with filtering and sorting
     * @param {Object} filters - Filter object with page, limit, search, etc.
     * @returns {Promise} Paginated operations response
     */
    async getOperationsPaginated(filters = {}) {
        const queryString = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                queryString.set(key, value);
            }
        });

        const url = `/api/operations?${queryString.toString()}`;
        return await this.fetchWithAuth(url);
    }
}

// Create global instance
const db = new DatabaseManager();

// Initialize immediately
let dbInitPromise = null;

function ensureDBInit() {
    if (!dbInitPromise) {
        dbInitPromise = (async () => {
            try {
                await db.init();
                console.log('API Database initialized successfully');
                return db;
            } catch (error) {
                console.error('API Database initialization failed:', error);
                throw error;
            }
        })();
    }
    return dbInitPromise;
}

// Initialize on load
if (typeof window !== 'undefined') {
    ensureDBInit();
}
