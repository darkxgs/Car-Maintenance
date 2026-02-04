import sql from './db.js';

async function setupDatabase() {
  try {
    console.log('Creating tables...');

    // Create branches table
    await sql`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create cars table
    await sql`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year_from INTEGER NOT NULL,
        year_to INTEGER NOT NULL,
        engine_size VARCHAR(50) NOT NULL,
        oil_type VARCHAR(100) NOT NULL,
        oil_viscosity VARCHAR(50) NOT NULL,
        oil_quantity DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create operations table
    await sql`
      CREATE TABLE IF NOT EXISTS operations (
        id SERIAL PRIMARY KEY,
        car_brand VARCHAR(100) NOT NULL,
        car_model VARCHAR(100) NOT NULL,
        car_year INTEGER NOT NULL,
        engine_size VARCHAR(50) NOT NULL,
        oil_used VARCHAR(100) NOT NULL,
        oil_viscosity VARCHAR(50) NOT NULL,
        oil_quantity DECIMAL(5,2) NOT NULL,
        oil_filter SMALLINT DEFAULT 0,
        air_filter SMALLINT DEFAULT 0,
        cooling_filter SMALLINT DEFAULT 0,
        is_matching SMALLINT DEFAULT 1,
        mismatch_reason TEXT,
        operation_type VARCHAR(50) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_operations_branch ON operations(branch_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_operations_user ON operations(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_operations_created ON operations(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_operations_matching ON operations(is_matching)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_model ON cars(model)`;

    console.log('✅ Tables created successfully');

    // Check if data exists
    const branchCount = await sql`SELECT COUNT(*) as count FROM branches`;
    
    if (branchCount[0].count === '0') {
      console.log('Seeding initial data...');
      
      // Insert branches
      await sql`
        INSERT INTO branches (name, location) VALUES
        ('الفرع الرئيسي', 'القاهرة'),
        ('فرع الإسكندرية', 'الإسكندرية'),
        ('فرع الجيزة', 'الجيزة')
      `;

      // Insert users (password: admin123 and 123456 hashed with bcrypt)
      const bcrypt = await import('bcryptjs');
      const adminHash = await bcrypt.hash('admin123', 10);
      const employeeHash = await bcrypt.hash('123456', 10);

      await sql`
        INSERT INTO users (username, password, name, branch_id, role) VALUES
        ('admin', ${adminHash}, 'مدير النظام', 1, 'admin'),
        ('employee1', ${employeeHash}, 'أحمد محمد', 1, 'employee')
      `;

      // Insert sample cars
      const carsData = [
        ['Toyota', 'Camry', 2018, 2024, '2.5L', 'Toyota Genuine', '0W-20', 4.5],
        ['Toyota', 'Camry', 2012, 2017, '2.5L', 'Toyota Genuine', '5W-30', 4.5],
        ['Toyota', 'Corolla', 2019, 2024, '1.8L', 'Toyota Genuine', '0W-20', 4.0],
        ['Toyota', 'Corolla', 2014, 2018, '1.8L', 'Toyota Genuine', '5W-30', 4.0],
        ['Toyota', 'Land Cruiser', 2016, 2024, '4.5L', 'Toyota Genuine', '5W-30', 8.0],
        ['Toyota', 'Hilux', 2016, 2024, '2.7L', 'Toyota Genuine', '5W-30', 5.5],
        ['Toyota', 'Yaris', 2018, 2024, '1.5L', 'Toyota Genuine', '0W-20', 3.5],
        ['Hyundai', 'Elantra', 2017, 2024, '1.6L', 'Hyundai Genuine', '5W-30', 4.0],
        ['Hyundai', 'Accent', 2018, 2024, '1.4L', 'Hyundai Genuine', '5W-30', 3.5],
        ['Hyundai', 'Tucson', 2016, 2024, '2.0L', 'Hyundai Genuine', '5W-30', 4.5],
        ['Hyundai', 'Sonata', 2015, 2024, '2.4L', 'Hyundai Genuine', '5W-20', 5.0],
        ['Nissan', 'Sunny', 2015, 2024, '1.5L', 'Nissan Genuine', '5W-30', 3.5],
        ['Nissan', 'Sentra', 2016, 2024, '1.8L', 'Nissan Genuine', '5W-30', 4.0],
        ['Nissan', 'X-Trail', 2017, 2024, '2.5L', 'Nissan Genuine', '5W-30', 5.0],
        ['Nissan', 'Patrol', 2010, 2024, '5.6L', 'Nissan Genuine', '5W-30', 7.5],
        ['Kia', 'Cerato', 2016, 2024, '1.6L', 'Kia Genuine', '5W-30', 4.0],
        ['Kia', 'Sportage', 2017, 2024, '2.0L', 'Kia Genuine', '5W-30', 4.5],
        ['Kia', 'Picanto', 2017, 2024, '1.2L', 'Kia Genuine', '5W-30', 3.0],
        ['Chevrolet', 'Cruze', 2015, 2020, '1.8L', 'GM Genuine', '5W-30', 4.0],
        ['Chevrolet', 'Aveo', 2014, 2020, '1.6L', 'GM Genuine', '5W-30', 3.5],
        ['BMW', '320i', 2016, 2024, '2.0L', 'BMW Longlife', '0W-30', 5.0],
        ['BMW', '520i', 2017, 2024, '2.0L', 'BMW Longlife', '0W-30', 5.5],
        ['BMW', 'X5', 2014, 2024, '3.0L', 'BMW Longlife', '0W-40', 6.5],
        ['Mercedes-Benz', 'C200', 2015, 2024, '2.0L', 'Mercedes-Benz Genuine', '5W-30', 5.5],
        ['Mercedes-Benz', 'E200', 2016, 2024, '2.0L', 'Mercedes-Benz Genuine', '5W-30', 6.0],
        ['Mercedes-Benz', 'GLC', 2016, 2024, '2.0L', 'Mercedes-Benz Genuine', '5W-30', 5.5],
        ['Honda', 'Civic', 2016, 2024, '1.5L', 'Honda Genuine', '0W-20', 3.5],
        ['Honda', 'Accord', 2018, 2024, '1.5L', 'Honda Genuine', '0W-20', 4.0],
        ['Honda', 'CR-V', 2017, 2024, '1.5L', 'Honda Genuine', '0W-20', 4.0]
      ];

      for (const car of carsData) {
        await sql`
          INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
          VALUES (${car[0]}, ${car[1]}, ${car[2]}, ${car[3]}, ${car[4]}, ${car[5]}, ${car[6]}, ${car[7]})
        `;
      }

      console.log('✅ Initial data seeded successfully');
    } else {
      console.log('✅ Data already exists, skipping seed');
    }

    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

setupDatabase();
