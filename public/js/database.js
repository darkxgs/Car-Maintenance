// ===== Database Manager =====
// Uses IndexedDB for persistent local storage

const DB_NAME = 'CarMaintenanceDB';
const DB_VERSION = 1;

class DatabaseManager {
    constructor() {
        this.db = null;
    }

    // Initialize Database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create Branches Store
                if (!db.objectStoreNames.contains('branches')) {
                    const branchStore = db.createObjectStore('branches', { keyPath: 'id', autoIncrement: true });
                    branchStore.createIndex('name', 'name', { unique: true });
                }

                // Create Users Store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('branch_id', 'branch_id', { unique: false });
                }

                // Create Cars Store (Reference Data)
                if (!db.objectStoreNames.contains('cars')) {
                    const carStore = db.createObjectStore('cars', { keyPath: 'id', autoIncrement: true });
                    carStore.createIndex('brand', 'brand', { unique: false });
                    carStore.createIndex('model', 'model', { unique: false });
                    carStore.createIndex('brand_model', ['brand', 'model'], { unique: false });
                }

                // Create Operations Store
                if (!db.objectStoreNames.contains('operations')) {
                    const opStore = db.createObjectStore('operations', { keyPath: 'id', autoIncrement: true });
                    opStore.createIndex('branch_id', 'branch_id', { unique: false });
                    opStore.createIndex('user_id', 'user_id', { unique: false });
                    opStore.createIndex('created_at', 'created_at', { unique: false });
                    opStore.createIndex('is_matching', 'is_matching', { unique: false });
                }
            };
        });
    }

    // Generic CRUD Operations
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getOneByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.get(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async count(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Seed initial data
    async seedData() {
        const branchCount = await this.count('branches');
        
        if (branchCount === 0) {
            // Add default branches
            const branches = [
                { name: 'الفرع الرئيسي', location: 'القاهرة' },
                { name: 'فرع الإسكندرية', location: 'الإسكندرية' },
                { name: 'فرع الجيزة', location: 'الجيزة' }
            ];

            for (const branch of branches) {
                await this.add('branches', branch);
            }

            // Add default admin user
            await this.add('users', {
                username: 'admin',
                password: 'admin123', // In production, use proper hashing
                name: 'مدير النظام',
                branch_id: 1,
                role: 'admin'
            });

            // Add sample employee
            await this.add('users', {
                username: 'employee1',
                password: '123456',
                name: 'أحمد محمد',
                branch_id: 1,
                role: 'employee'
            });

            // Add sample cars database
            const carsData = [
                // Toyota
                { brand: 'Toyota', model: 'Camry', year_from: 2018, year_to: 2024, engine_size: '2.5L', oil_type: 'Toyota Genuine', oil_viscosity: '0W-20', oil_quantity: 4.5 },
                { brand: 'Toyota', model: 'Camry', year_from: 2012, year_to: 2017, engine_size: '2.5L', oil_type: 'Toyota Genuine', oil_viscosity: '5W-30', oil_quantity: 4.5 },
                { brand: 'Toyota', model: 'Corolla', year_from: 2019, year_to: 2024, engine_size: '1.8L', oil_type: 'Toyota Genuine', oil_viscosity: '0W-20', oil_quantity: 4.0 },
                { brand: 'Toyota', model: 'Corolla', year_from: 2014, year_to: 2018, engine_size: '1.8L', oil_type: 'Toyota Genuine', oil_viscosity: '5W-30', oil_quantity: 4.0 },
                { brand: 'Toyota', model: 'Land Cruiser', year_from: 2016, year_to: 2024, engine_size: '4.5L', oil_type: 'Toyota Genuine', oil_viscosity: '5W-30', oil_quantity: 8.0 },
                { brand: 'Toyota', model: 'Hilux', year_from: 2016, year_to: 2024, engine_size: '2.7L', oil_type: 'Toyota Genuine', oil_viscosity: '5W-30', oil_quantity: 5.5 },
                { brand: 'Toyota', model: 'Yaris', year_from: 2018, year_to: 2024, engine_size: '1.5L', oil_type: 'Toyota Genuine', oil_viscosity: '0W-20', oil_quantity: 3.5 },
                
                // Hyundai
                { brand: 'Hyundai', model: 'Elantra', year_from: 2017, year_to: 2024, engine_size: '1.6L', oil_type: 'Hyundai Genuine', oil_viscosity: '5W-30', oil_quantity: 4.0 },
                { brand: 'Hyundai', model: 'Accent', year_from: 2018, year_to: 2024, engine_size: '1.4L', oil_type: 'Hyundai Genuine', oil_viscosity: '5W-30', oil_quantity: 3.5 },
                { brand: 'Hyundai', model: 'Tucson', year_from: 2016, year_to: 2024, engine_size: '2.0L', oil_type: 'Hyundai Genuine', oil_viscosity: '5W-30', oil_quantity: 4.5 },
                { brand: 'Hyundai', model: 'Sonata', year_from: 2015, year_to: 2024, engine_size: '2.4L', oil_type: 'Hyundai Genuine', oil_viscosity: '5W-20', oil_quantity: 5.0 },
                
                // Nissan
                { brand: 'Nissan', model: 'Sunny', year_from: 2015, year_to: 2024, engine_size: '1.5L', oil_type: 'Nissan Genuine', oil_viscosity: '5W-30', oil_quantity: 3.5 },
                { brand: 'Nissan', model: 'Sentra', year_from: 2016, year_to: 2024, engine_size: '1.8L', oil_type: 'Nissan Genuine', oil_viscosity: '5W-30', oil_quantity: 4.0 },
                { brand: 'Nissan', model: 'X-Trail', year_from: 2017, year_to: 2024, engine_size: '2.5L', oil_type: 'Nissan Genuine', oil_viscosity: '5W-30', oil_quantity: 5.0 },
                { brand: 'Nissan', model: 'Patrol', year_from: 2010, year_to: 2024, engine_size: '5.6L', oil_type: 'Nissan Genuine', oil_viscosity: '5W-30', oil_quantity: 7.5 },
                
                // Kia
                { brand: 'Kia', model: 'Cerato', year_from: 2016, year_to: 2024, engine_size: '1.6L', oil_type: 'Kia Genuine', oil_viscosity: '5W-30', oil_quantity: 4.0 },
                { brand: 'Kia', model: 'Sportage', year_from: 2017, year_to: 2024, engine_size: '2.0L', oil_type: 'Kia Genuine', oil_viscosity: '5W-30', oil_quantity: 4.5 },
                { brand: 'Kia', model: 'Picanto', year_from: 2017, year_to: 2024, engine_size: '1.2L', oil_type: 'Kia Genuine', oil_viscosity: '5W-30', oil_quantity: 3.0 },
                
                // Chevrolet
                { brand: 'Chevrolet', model: 'Cruze', year_from: 2015, year_to: 2020, engine_size: '1.8L', oil_type: 'GM Genuine', oil_viscosity: '5W-30', oil_quantity: 4.0 },
                { brand: 'Chevrolet', model: 'Aveo', year_from: 2014, year_to: 2020, engine_size: '1.6L', oil_type: 'GM Genuine', oil_viscosity: '5W-30', oil_quantity: 3.5 },
                
                // BMW
                { brand: 'BMW', model: '320i', year_from: 2016, year_to: 2024, engine_size: '2.0L', oil_type: 'BMW Longlife', oil_viscosity: '0W-30', oil_quantity: 5.0 },
                { brand: 'BMW', model: '520i', year_from: 2017, year_to: 2024, engine_size: '2.0L', oil_type: 'BMW Longlife', oil_viscosity: '0W-30', oil_quantity: 5.5 },
                { brand: 'BMW', model: 'X5', year_from: 2014, year_to: 2024, engine_size: '3.0L', oil_type: 'BMW Longlife', oil_viscosity: '0W-40', oil_quantity: 6.5 },
                
                // Mercedes-Benz
                { brand: 'Mercedes-Benz', model: 'C200', year_from: 2015, year_to: 2024, engine_size: '2.0L', oil_type: 'Mercedes-Benz Genuine', oil_viscosity: '5W-30', oil_quantity: 5.5 },
                { brand: 'Mercedes-Benz', model: 'E200', year_from: 2016, year_to: 2024, engine_size: '2.0L', oil_type: 'Mercedes-Benz Genuine', oil_viscosity: '5W-30', oil_quantity: 6.0 },
                { brand: 'Mercedes-Benz', model: 'GLC', year_from: 2016, year_to: 2024, engine_size: '2.0L', oil_type: 'Mercedes-Benz Genuine', oil_viscosity: '5W-30', oil_quantity: 5.5 },
                
                // Honda
                { brand: 'Honda', model: 'Civic', year_from: 2016, year_to: 2024, engine_size: '1.5L', oil_type: 'Honda Genuine', oil_viscosity: '0W-20', oil_quantity: 3.5 },
                { brand: 'Honda', model: 'Accord', year_from: 2018, year_to: 2024, engine_size: '1.5L', oil_type: 'Honda Genuine', oil_viscosity: '0W-20', oil_quantity: 4.0 },
                { brand: 'Honda', model: 'CR-V', year_from: 2017, year_to: 2024, engine_size: '1.5L', oil_type: 'Honda Genuine', oil_viscosity: '0W-20', oil_quantity: 4.0 }
            ];

            for (const car of carsData) {
                await this.add('cars', car);
            }
        }
    }

    // Car-specific queries
    async findCar(brand, model, year, engineSize) {
        const cars = await this.getAll('cars');
        return cars.find(car => 
            car.brand.toLowerCase() === brand.toLowerCase() &&
            car.model.toLowerCase() === model.toLowerCase() &&
            year >= car.year_from && year <= car.year_to &&
            car.engine_size.toLowerCase() === engineSize.toLowerCase()
        );
    }

    async getCarBrands() {
        const cars = await this.getAll('cars');
        return [...new Set(cars.map(car => car.brand))].sort();
    }

    async getModelsByBrand(brand) {
        const cars = await this.getAll('cars');
        const filtered = cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
        return [...new Set(filtered.map(car => car.model))].sort();
    }

    async getEngineSizesByModel(brand, model) {
        const cars = await this.getAll('cars');
        const filtered = cars.filter(car => 
            car.brand.toLowerCase() === brand.toLowerCase() &&
            car.model.toLowerCase() === model.toLowerCase()
        );
        return [...new Set(filtered.map(car => car.engine_size))].sort();
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
        let operations = await this.getAll('operations');
        
        // Filter by branch
        if (branchId) {
            operations = operations.filter(op => op.branch_id === branchId);
        }
        
        // Filter by date
        if (startDate && endDate) {
            operations = operations.filter(op => {
                const opDate = new Date(op.created_at);
                return opDate >= new Date(startDate) && opDate <= new Date(endDate);
            });
        }

        // Calculate stats
        const totalOperations = operations.length;
        const matchingOperations = operations.filter(op => op.is_matching === 1).length;
        const mismatchedOperations = totalOperations - matchingOperations;

        // Oil types used
        const oilTypes = {};
        const viscosities = {};
        let totalOilUsed = 0;
        let oilFilterCount = 0;
        let airFilterCount = 0;
        let coolingFilterCount = 0;

        operations.forEach(op => {
            // Oil types
            if (op.oil_used) {
                oilTypes[op.oil_used] = (oilTypes[op.oil_used] || 0) + 1;
            }
            
            // Viscosities
            if (op.oil_viscosity) {
                viscosities[op.oil_viscosity] = (viscosities[op.oil_viscosity] || 0) + 1;
            }
            
            // Total oil
            totalOilUsed += parseFloat(op.oil_quantity) || 0;
            
            // Filters
            if (op.oil_filter === 1) oilFilterCount++;
            if (op.air_filter === 1) airFilterCount++;
            if (op.cooling_filter === 1) coolingFilterCount++;
        });

        return {
            totalOperations,
            matchingOperations,
            mismatchedOperations,
            oilTypes,
            viscosities,
            totalOilUsed: totalOilUsed.toFixed(1),
            filters: {
                oil: oilFilterCount,
                air: airFilterCount,
                cooling: coolingFilterCount
            }
        };
    }

    async getCarCountByBranch() {
        const operations = await this.getAll('operations');
        const branches = await this.getAll('branches');
        
        const counts = {};
        branches.forEach(branch => {
            counts[branch.name] = operations.filter(op => op.branch_id === branch.id).length;
        });
        
        return counts;
    }
}

// Create global instance
const db = new DatabaseManager();

// Initialize immediately and only once
let dbInitPromise = null;

function ensureDBInit() {
    if (!dbInitPromise) {
        dbInitPromise = (async () => {
            try {
                await db.init();
                await db.seedData();
                console.log('Database initialized successfully');
                return db;
            } catch (error) {
                console.error('Database initialization failed:', error);
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
