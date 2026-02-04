import Head from 'next/head'
import Script from 'next/script'

export default function CarsDatabase() {
  return (
    <>
      <Head>
        <title>قاعدة بيانات السيارات - نظام صيانة السيارات</title>
      </Head>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <i className="fas fa-car-side"></i>
            <div>
              <h2>صيانة السيارات</h2><span>نظام الإدارة</span>
            </div>
          </div>
          <nav className="sidebar-menu">
            <a href="/dashboard"><i className="fas fa-home"></i> لوحة التحكم</a>
            <a href="/operation"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="menu-title">الإدارة</div>
            <a href="/admin/users"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="active"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </nav>
          <div className="sidebar-user" suppressHydrationWarning>
            <div className="avatar" suppressHydrationWarning>م</div>
            <div className="user-info" suppressHydrationWarning>
              <h4 suppressHydrationWarning>اسم المستخدم</h4><span suppressHydrationWarning>الفرع</span>
            </div>
            <button className="logout-btn"><i className="fas fa-sign-out-alt"></i></button>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1><i className="fas fa-database"></i> قاعدة بيانات السيارات</h1>
            <button className="btn btn-primary" onClick={() => { }}><i className="fas fa-plus"></i> إضافة سيارة</button>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>نوع السيارة</label>
                  <input type="text" id="searchBrand" placeholder="بحث..." />
                </div>
                <div className="form-group">
                  <label>الموديل</label>
                  <input type="text" id="searchModel" placeholder="بحث..." />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => { }}><i className="fas fa-search"></i> بحث</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-container">
                <table id="carsTable">
                  <thead>
                    <tr>
                      <th>النوع</th>
                      <th>الموديل</th>
                      <th>السنوات</th>
                      <th>المحرك</th>
                      <th>الزيت</th>
                      <th>اللزوجة</th>
                      <th>الكمية</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="modal-overlay" id="carModal">
        <div className="modal" style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <h3 id="modalTitle"><i className="fas fa-car"></i> إضافة سيارة</h3>
            <button className="close-btn" onClick={() => { }}>&times;</button>
          </div>
          <div className="modal-body">
            <form id="carForm">
              <input type="hidden" id="carId" />
              <div className="form-row">
                <div className="form-group">
                  <label>نوع السيارة</label>
                  <input type="text" id="carBrand" required />
                </div>
                <div className="form-group">
                  <label>الموديل</label>
                  <input type="text" id="carModel" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>من سنة</label>
                  <input type="number" id="carYearFrom" required min="1990" max="2030" />
                </div>
                <div className="form-group">
                  <label>إلى سنة</label>
                  <input type="number" id="carYearTo" required min="1990" max="2030" />
                </div>
                <div className="form-group">
                  <label>حجم المحرك</label>
                  <input type="text" id="carEngine" required placeholder="مثال: 2.5L" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>نوع الزيت</label>
                  <input type="text" id="carOilType" required />
                </div>
                <div className="form-group">
                  <label>اللزوجة</label>
                  <select id="carOilViscosity" required>
                    <option value="0W-20">0W-20</option>
                    <option value="0W-30">0W-30</option>
                    <option value="5W-20">5W-20</option>
                    <option value="5W-30">5W-30</option>
                    <option value="5W-40">5W-40</option>
                    <option value="10W-30">10W-30</option>
                    <option value="10W-40">10W-40</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>الكمية (لتر)</label>
                  <input type="number" id="carOilQty" required step="0.1" min="0" />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => { }}><i className="fas fa-save"></i> حفظ</button>
            <button className="btn btn-outline" onClick={() => { }}>إلغاء</button>
          </div>
        </div>
      </div>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script id="cars-database-script" strategy="afterInteractive">{`
        (async function() {
            if (!auth.requireAdmin()) return;
            
            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            
            await loadCars();
        })();

        async function loadCars() {
            let cars = await db.getAll('cars');
            const brand = document.getElementById('searchBrand').value.toLowerCase();
            const model = document.getElementById('searchModel').value.toLowerCase();

            if (brand) cars = cars.filter(c => c.brand.toLowerCase().includes(brand));
            if (model) cars = cars.filter(c => c.model.toLowerCase().includes(model));

            const tbody = document.querySelector('#carsTable tbody');
            tbody.innerHTML = cars.map(c => \`<tr>
                <td>\${c.brand}</td><td>\${c.model}</td><td>\${c.year_from} - \${c.year_to}</td>
                <td>\${c.engine_size}</td><td>\${c.oil_type}</td><td>\${c.oil_viscosity}</td><td>\${c.oil_quantity}L</td>
                <td>
                    <button class="btn btn-outline" onclick="editCar(\${c.id})" style="padding: 0.5rem;"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="deleteCar(\${c.id})" style="padding: 0.5rem;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>\`).join('');
        }

        function showAddModal() {
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-car"></i> إضافة سيارة';
            document.getElementById('carForm').reset();
            document.getElementById('carId').value = '';
            document.getElementById('carModal').classList.add('show');
        }

        async function editCar(id) {
            const car = await db.get('cars', id);
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> تعديل سيارة';
            document.getElementById('carId').value = car.id;
            document.getElementById('carBrand').value = car.brand;
            document.getElementById('carModel').value = car.model;
            document.getElementById('carYearFrom').value = car.year_from;
            document.getElementById('carYearTo').value = car.year_to;
            document.getElementById('carEngine').value = car.engine_size;
            document.getElementById('carOilType').value = car.oil_type;
            document.getElementById('carOilViscosity').value = car.oil_viscosity;
            document.getElementById('carOilQty').value = car.oil_quantity;
            document.getElementById('carModal').classList.add('show');
        }

        function closeModal() { document.getElementById('carModal').classList.remove('show'); }

        async function saveCar() {
            const id = document.getElementById('carId').value;
            const carData = {
                brand: document.getElementById('carBrand').value,
                model: document.getElementById('carModel').value,
                year_from: parseInt(document.getElementById('carYearFrom').value),
                year_to: parseInt(document.getElementById('carYearTo').value),
                engine_size: document.getElementById('carEngine').value,
                oil_type: document.getElementById('carOilType').value,
                oil_viscosity: document.getElementById('carOilViscosity').value,
                oil_quantity: parseFloat(document.getElementById('carOilQty').value)
            };

            if (id) {
                carData.id = parseInt(id);
                await db.update('cars', carData);
                showToast('تم تحديث السيارة', 'success');
            } else {
                await db.add('cars', carData);
                showToast('تم إضافة السيارة', 'success');
            }
            closeModal();
            await loadCars();
        }

        async function deleteCar(id) {
            if (!confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;
            await db.delete('cars', id);
            showToast('تم حذف السيارة', 'success');
            await loadCars();
        }

        document.querySelector('.page-header .btn-primary').addEventListener('click', showAddModal);
        document.querySelector('.card .btn-primary').addEventListener('click', loadCars);
        document.querySelector('.modal-overlay .close-btn').addEventListener('click', closeModal);
        document.querySelectorAll('.modal-footer .btn-outline').forEach(btn => btn.addEventListener('click', closeModal));
        document.querySelectorAll('.modal-footer .btn-success').forEach(btn => btn.addEventListener('click', saveCar));
      `}</Script>
    </>
  )
}
