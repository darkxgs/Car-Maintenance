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
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => window.showAddModal()}><i className="fas fa-plus"></i> إضافة سيارة</button>
              <div style={{ borderLeft: '1px solid #ccc', margin: '0 0.5rem', display: 'none' }} className="desktop-separator"></div>
              <button className="btn" style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none' }} onClick={() => window.showImportModal()}><i className="fas fa-file-import"></i> استيراد (CSV)</button>
              <button className="btn btn-secondary" onClick={() => exportToCSV()}><i className="fas fa-file-export"></i> تصدير (CSV)</button>
            </div>
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
            <button className="close-btn" onClick={() => closeModal('carModal')}>&times;</button>
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
                    <option value="15W-40">15W-40</option>
                    <option value="20W-50">20W-50</option>
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
            <button className="btn btn-success" onClick={() => saveCar()}><i className="fas fa-save"></i> حفظ</button>
            <button className="btn btn-outline" onClick={() => closeModal('carModal')}>إلغاء</button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <div className="modal-overlay" id="importModal">
        <div className="modal" style={{ maxWidth: '500px' }}>
          <div className="modal-header">
            <h3><i className="fas fa-file-import"></i> استيراد سيارات (CSV)</h3>
            <button className="close-btn" onClick={() => closeModal('importModal')}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info" style={{ background: '#e3f2fd', color: '#0d47a1', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
              <i className="fas fa-info-circle"></i> <strong>تعليمات:</strong><br />
              يرجى تحميل النموذج أولاً وتعبئة البيانات ثم إعادة رفعه.<br />
              الأعمدة: <code style={{ fontFamily: 'monospace' }}>brand, model, year_from, ...</code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => downloadTemplate()} style={{ justifyContent: 'center', borderColor: '#28a745', color: '#28a745' }}>
                <i className="fas fa-download"></i> 1. تحميل النموذج المسبق
              </button>

              <div style={{ borderTop: '1px solid #eee', margin: '0.5rem 0' }}></div>

              <label className="btn btn-primary" style={{ justifyContent: 'center', cursor: 'pointer', background: '#6f42c1', border: 'none' }}>
                <i className="fas fa-upload"></i> 2. اختيار ملف ورفعه
                <input type="file" id="importFile" accept=".csv" style={{ display: 'none' }} onChange={(e) => importCars(e)} />
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => closeModal('importModal')}>إغلاق</button>
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
        
        function downloadTemplate() {
            const headers = ['brand', 'model', 'year_from', 'year_to', 'engine_size', 'oil_type', 'oil_viscosity', 'oil_quantity'];
            const exampleRow = ['Toyota', 'Camry', '2018', '2022', '2.5L', 'Synthetic', '0W-20', '4.5'];
            const csvContent = [headers.join(','), exampleRow.join(',')].join('\\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "car_import_template.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        async function exportToCSV() {
            const cars = await db.getAll('cars');
            if (cars.length === 0) {
                showToast('لا توجد بيانات للتصدير', 'warning');
                return;
            }

            // Define headers matching DB columns for easier import mapping
            const headers = ['brand', 'model', 'year_from', 'year_to', 'engine_size', 'oil_type', 'oil_viscosity', 'oil_quantity'];
            const csvContent = [
                headers.join(','), // Header row
                ...cars.map(c => headers.map(h => {
                    const val = c[h] || '';
                    // Escape commas in strings
                    return typeof val === 'string' && val.includes(',') ? \`"\${val}"\` : val;
                }).join(','))
            ].join('\\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "cars_database.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        async function importCars(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async function(e) {
                const text = e.target.result;
                const rows = text.split('\\n').map(r => r.trim()).filter(r => r);
                
                if (rows.length < 2) {
                    showToast('الملف فارغ أو لا يحتوي على بيانات', 'error');
                    return;
                }

                const headers = rows[0].split(',').map(h => h.trim());
                // Basic validation of headers
                const required = ['brand', 'model', 'year_from', 'year_to', 'engine_size', 'oil_type', 'oil_viscosity', 'oil_quantity'];
                const missing = required.filter(r => !headers.includes(r));
                
                if (missing.length > 0) {
                     showToast(\`خطأ: الأعمدة التالية مفقودة: \${missing.join(', ')}\`, 'error');
                     return;
                }

                const carsToAdd = [];
                const errors = [];
                
                // Start from 1 to skip header
                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(',');
                    // Handle simple CSV splitting (doesn't handle quoted commas fully robustly but works for template)
                    
                    if (values.length !== headers.length) {
                        errors.push(\`السطر \${i + 1}: عدد الأعمدة غير صحيح\`);
                        continue;
                    }
                    
                    const car = {};
                    let rowHasError = false;
                    
                    headers.forEach((h, index) => {
                        let val = values[index].trim();
                        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                        
                        // Parse numbers
                        if (['year_from', 'year_to'].includes(h)) {
                             const num = parseInt(val);
                            if (isNaN(num)) {
                                errors.push(\`السطر \${i + 1}: السنة غير صالحة (\${val})\`);
                                rowHasError = true;
                            }
                            val = num;
                        }
                        if (['oil_quantity'].includes(h)) {
                            const num = parseFloat(val);
                            if (isNaN(num)) {
                                errors.push(\`السطر \${i + 1}: الكمية غير صالحة (\${val})\`);
                                rowHasError = true;
                            }
                            val = num;
                        }
                        
                        car[h] = val;
                    });
                    
                    if (!rowHasError) {
                        carsToAdd.push(car);
                    }
                }

                if (errors.length > 0) {
                    // Show first 3 errors to avoid spamming
                    const errorMsg = errors.slice(0, 3).join('<br>');
                    showToast(\`وجدنا بعض الأخطاء:<br>\${errorMsg}\${errors.length > 3 ? '<br>...والمزيد' : ''}\`, 'warning');
                    if (carsToAdd.length === 0) return; // Stop if nothing matches
                }

                if (carsToAdd.length === 0) {
                    showToast('لم يتم العثور على بيانات صالحة للاستيراد', 'warning');
                    return;
                }

                if(!confirm(\`هل تريد استيراد \${carsToAdd.length} سيارة؟\\n(تم تجاهل \${errors.length} صفوف غير صالحة)\`)) {
                    event.target.value = '';
                    return;
                }
                
                try {
                    showToast(\`جاري استيراد \${carsToAdd.length} سيارة... هذا قد يستغرق لحظات\`, 'info');
                    // Hide the Import modal, but keep working
                    document.getElementById('importModal').classList.remove('show');
                    
                    await db.add('cars', carsToAdd);
                    showToast(\`تم استيراد \${carsToAdd.length} سيارة بنجاح\`, 'success');
                    await loadCars();
                } catch (err) {
                    console.error(err);
                    showToast('حدث خطأ أثناء الاستيراد. تأكد من صحة البيانات.', 'error');
                }
                
                event.target.value = '';
            };
            reader.readAsText(file);
        }

        function showAddModal() {
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-car"></i> إضافة سيارة';
            document.getElementById('carForm').reset();
            document.getElementById('carId').value = '';
            document.getElementById('carModal').classList.add('show');
        }
        
        function showImportModal() {
            document.getElementById('importModal').classList.add('show');
        }

        function closeModal(id) {
             const modalId = id && typeof id === 'string' ? id : 'carModal';
             document.getElementById(modalId).classList.remove('show');
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
            closeModal('carModal');
            await loadCars();
        }

        async function deleteCar(id) {
            if (!confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;
            await db.delete('cars', id);
            showToast('تم حذف السيارة', 'success');
            await loadCars();
        }

        // Attach event listeners safely
        if (typeof document !== 'undefined') {
            const addBtn = document.querySelector('.page-header .btn-primary');
            if (addBtn) addBtn.addEventListener('click', showAddModal);
            
            const searchBtn = document.querySelector('.card .btn-primary');
            if (searchBtn) searchBtn.addEventListener('click', loadCars);
            
            // Note: close buttons are now inline onclick usually, but let's keep this safe
            document.querySelectorAll('.modal-overlay .close-btn').forEach(btn => btn.addEventListener('click', (e) => {
                 const modal = e.target.closest('.modal-overlay');
                 if(modal) modal.classList.remove('show');
            }));
            
            document.querySelectorAll('.modal-footer .btn-outline').forEach(btn => btn.addEventListener('click', (e) => {
                 const modal = e.target.closest('.modal-overlay');
                 if(modal) modal.classList.remove('show');
            }));
            
            // Expose vars for inline onclicks (legacy vibe but works for this)
            window.editCar = editCar;
            window.deleteCar = deleteCar;
            window.exportToCSV = exportToCSV;
            window.importCars = importCars;
            window.showAddModal = showAddModal;
            window.showImportModal = showImportModal;
            window.closeModal = closeModal;
            window.saveCar = saveCar;
            window.downloadTemplate = downloadTemplate;
        }
      `}</Script>
    </>
  )
}
