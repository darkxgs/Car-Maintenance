import Head from 'next/head'
import Script from 'next/script'

export default function Operation() {
  return (
    <>
      <Head>
        <title>تسجيل عملية - نظام صيانة السيارات</title>
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
            <a href="/operation" className="active"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="menu-title admin-only">الإدارة</div>
            <a href="/admin/users" className="admin-only"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="admin-only"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="admin-only"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </nav>
          <div className="sidebar-user" suppressHydrationWarning>
            <div className="avatar" suppressHydrationWarning>م</div>
            <div className="user-info" suppressHydrationWarning>
              <h4 suppressHydrationWarning>اسم المستخدم</h4><span suppressHydrationWarning>الفرع</span>
            </div>
            <button className="logout-btn" title="تسجيل الخروج"><i className="fas fa-sign-out-alt"></i></button>
          </div>
        </aside>

        {/* Mobile Menu Bar */}
        <div className="mobile-menu-bar">
          <div className="mobile-menu-header">
            <i className="fas fa-car-side"></i>
            <span>صيانة السيارات</span>
          </div>
          <button className="mobile-menu-toggle" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="mobile-menu-dropdown" id="mobileMenuDropdown">
            <a href="/dashboard"><i className="fas fa-home"></i> لوحة التحكم</a>
            <a href="/operation" className="active"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="mobile-menu-divider"></div>
            <span className="mobile-menu-title">الإدارة</span>
            <a href="/admin/users" className="admin-only"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="admin-only"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="admin-only"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </div>
        </div>

        <main className="main-content">
          <div className="page-header">
            <h1><i className="fas fa-oil-can"></i> تسجيل عملية</h1>
            <div className="breadcrumb"><a href="/dashboard">الرئيسية</a> / <span>تسجيل عملية</span></div>
          </div>

          <div className="operation-tabs">
            <button className="tab-btn active" data-tab="inquiry">
              <i className="fas fa-search"></i>
              <h4>استعلام عن الزيت</h4>
              <p>البحث عن نوع وكمية الزيت المناسبة</p>
            </button>
            <button className="tab-btn" data-tab="service">
              <i className="fas fa-tools"></i>
              <h4>تسجيل عملية صيانة</h4>
              <p>تسجيل عملية تغيير زيت كاملة</p>
            </button>
          </div>

          <div className="card tab-content" id="inquiryForm">
            <div className="card-header">
              <h3><i className="fas fa-search"></i> استعلام عن الزيت المناسب</h3>
            </div>
            <div className="card-body">
              <form id="inquiryFormEl">
                <div className="form-row">
                  <div className="form-group">
                    <label>نوع السيارة</label>
                    <select id="inqBrand" required>
                      <option value="">اختر النوع</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>الموديل</label>
                    <select id="inqModel" required>
                      <option value="">اختر الموديل</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>حجم المحرك</label>
                    <select id="inqEngine" required>
                      <option value="">اختر حجم المحرك</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>سنة الصنع</label>
                    <input type="number" id="inqYear" placeholder="مثال: 2020" min="1990" max="2026" required />
                  </div>
                </div>
                <div className="ai-response" id="inquiryResult"></div>
                <button type="submit" className="btn btn-primary btn-lg"><i className="fas fa-search"></i> بحث</button>
              </form>
            </div>
          </div>

          <div className="card tab-content" id="serviceForm" style={{ display: 'none' }}>
            <div className="card-header">
              <h3><i className="fas fa-tools"></i> تسجيل عملية صيانة</h3>
            </div>
            <div className="card-body">
              <form id="serviceFormEl">
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray)' }}>بيانات السيارة</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>نوع السيارة</label>
                    <select id="svcBrand" required>
                      <option value="">اختر النوع</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>الموديل</label>
                    <select id="svcModel" required>
                      <option value="">اختر الموديل</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>حجم المحرك</label>
                    <select id="svcEngine" required>
                      <option value="">اختر حجم المحرك</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>سنة الصنع</label>
                    <input type="number" id="svcYear" placeholder="مثال: 2020" min="1990" max="2026" required />
                  </div>
                </div>

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--gray)' }}>بيانات الزيت</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>نوع الزيت المستخدم</label>
                    <input type="text" id="svcOil" placeholder="مثال: Toyota Genuine" required />
                  </div>
                  <div className="form-group">
                    <label>اللزوجة</label>
                    <select id="svcViscosity" required>
                      <option value="">اختر اللزوجة</option>
                      <option value="0W-20">0W-20</option>
                      <option value="0W-30">0W-30</option>
                      <option value="0W-40">0W-40</option>
                      <option value="5W-20">5W-20</option>
                      <option value="5W-30">5W-30</option>
                      <option value="5W-40">5W-40</option>
                      <option value="10W-30">10W-30</option>
                      <option value="10W-40">10W-40</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>الكمية (لتر)</label>
                    <input type="number" id="svcQuantity" placeholder="مثال: 4.5" step="0.1" min="0" required />
                  </div>
                </div>

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--gray)' }}>الفلاتر</h4>
                <div className="filters-group">
                  <div className="filter-item">
                    <input type="checkbox" id="oilFilter" />
                    <label htmlFor="oilFilter"><i className="fas fa-filter"></i> فلتر الزيت (تم التغيير)</label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" id="airFilter" />
                    <label htmlFor="airFilter"><i className="fas fa-wind"></i> فلتر الهواء (تم التغيير)</label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" id="coolingFilter" />
                    <label htmlFor="coolingFilter"><i className="fas fa-snowflake"></i> فلتر التبريد (تم التغيير)</label>
                  </div>
                </div>

                <div className="ai-response" id="serviceResult"></div>
                <button type="submit" className="btn btn-success btn-lg"><i className="fas fa-save"></i> تسجيل العملية</button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <div className="modal-overlay" id="mismatchModal">
        <div className="modal">
          <div className="modal-header">
            <h3><i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i> سبب الاختلاف</h3>
            <button className="close-btn" onClick={() => { }}>&times;</button>
          </div>
          <div className="modal-body">
            <div id="mismatchDetails"></div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>يرجى توضيح سبب الاختلاف عن البيانات المقترحة:</label>
              <textarea id="mismatchReason" rows="3" style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--light)', borderRadius: 'var(--radius)' }} required></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => { }}><i className="fas fa-check"></i> تأكيد وتسجيل</button>
            <button className="btn btn-outline" onClick={() => { }}>إلغاء</button>
          </div>
        </div>
      </div>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/ai-supervisor.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script src="/js/mobile-menu.js" strategy="afterInteractive" />
      <Script id="operation-script" strategy="afterInteractive">{`
        let pendingServiceData = null;

        (async function() {
            if (!auth.requireAuth()) return;
            
            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }

            setupTabs();
            await loadBrands();
        })();

        function setupTabs() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    document.getElementById('inquiryForm').style.display = btn.dataset.tab === 'inquiry' ? 'block' : 'none';
                    document.getElementById('serviceForm').style.display = btn.dataset.tab === 'service' ? 'block' : 'none';
                });
            });
        }

        async function loadBrands() {
            const brands = await db.getCarBrands();
            const options = '<option value="">اختر النوع</option>' + brands.map(b => \`<option value="\${b}">\${b}</option>\`).join('');

            document.getElementById('inqBrand').innerHTML = options;
            document.getElementById('svcBrand').innerHTML = options;

            ['inq', 'svc'].forEach(prefix => {
                document.getElementById(\`\${prefix}Brand\`).addEventListener('change', async (e) => {
                    const models = await db.getModelsByBrand(e.target.value);
                    document.getElementById(\`\${prefix}Model\`).innerHTML = '<option value="">اختر الموديل</option>' + models.map(m => \`<option value="\${m}">\${m}</option>\`).join('');
                    document.getElementById(\`\${prefix}Engine\`).innerHTML = '<option value="">اختر حجم المحرك</option>';
                });

                document.getElementById(\`\${prefix}Model\`).addEventListener('change', async (e) => {
                    const brand = document.getElementById(\`\${prefix}Brand\`).value;
                    const engines = await db.getEngineSizesByModel(brand, e.target.value);
                    document.getElementById(\`\${prefix}Engine\`).innerHTML = '<option value="">اختر حجم المحرك</option>' + engines.map(en => \`<option value="\${en}">\${en}</option>\`).join('');
                });
            });
        }

        document.getElementById('inquiryFormEl').addEventListener('submit', async (e) => {
            e.preventDefault();
            const result = await aiSupervisor.processInquiry({
                brand: document.getElementById('inqBrand').value,
                model: document.getElementById('inqModel').value,
                year: document.getElementById('inqYear').value,
                engineSize: document.getElementById('inqEngine').value
            });

            const resultDiv = document.getElementById('inquiryResult');
            resultDiv.classList.add('show');

            if (result.success) {
                resultDiv.className = 'ai-response show success';
                resultDiv.innerHTML = \`
                    <div class="ai-header"><i class="fas fa-robot"></i><h4>نتيجة البحث</h4></div>
                    <div class="ai-content">
                        <div class="result-item"><span>نوع الزيت:</span><strong>\${result.data.oilType}</strong></div>
                        <div class="result-item"><span>اللزوجة:</span><strong>\${result.data.oilViscosity}</strong></div>
                        <div class="result-item"><span>الكمية:</span><strong>\${result.data.oilQuantity} لتر</strong></div>
                    </div>\`;
                showToast(result.message, 'success');
            } else {
                resultDiv.className = 'ai-response show warning';
                resultDiv.innerHTML = \`<div class="ai-header"><i class="fas fa-exclamation-triangle"></i><h4>تنبيه</h4></div><div class="ai-content">\${result.message}</div>\`;
                showToast(result.message, 'warning');
            }
        });

        document.getElementById('serviceFormEl').addEventListener('submit', async (e) => {
            e.preventDefault();
            const serviceData = {
                brand: document.getElementById('svcBrand').value,
                model: document.getElementById('svcModel').value,
                year: document.getElementById('svcYear').value,
                engineSize: document.getElementById('svcEngine').value,
                oilUsed: document.getElementById('svcOil').value,
                oilViscosity: document.getElementById('svcViscosity').value,
                oilQuantity: document.getElementById('svcQuantity').value,
                oilFilter: document.getElementById('oilFilter').checked,
                airFilter: document.getElementById('airFilter').checked,
                coolingFilter: document.getElementById('coolingFilter').checked
            };

            const result = await aiSupervisor.processService(serviceData);
            handleServiceResult(result, serviceData);
        });

        function handleServiceResult(result, serviceData) {
            const resultDiv = document.getElementById('serviceResult');

            if (result.needsReason) {
                pendingServiceData = serviceData;
                showMismatchModal(result);
                return;
            }

            resultDiv.classList.add('show');
            if (result.success) {
                resultDiv.className = 'ai-response show success';
                resultDiv.innerHTML = \`<div class="ai-header"><i class="fas fa-check-circle"></i><h4>تم</h4></div><div class="ai-content">\${result.message}</div>\`;
                showToast('تم تسجيل العملية بنجاح', 'success');
                document.getElementById('serviceFormEl').reset();
            } else {
                resultDiv.className = 'ai-response show warning';
                resultDiv.innerHTML = \`<div class="ai-header"><i class="fas fa-exclamation-triangle"></i><h4>تنبيه</h4></div><div class="ai-content">\${result.message}</div>\`;
                showToast(result.message, 'warning');
            }
        }

        function showMismatchModal(result) {
            const details = result.mismatches.map(m => \`<p><strong>\${m.field}:</strong> المقترح: \${m.expected} | المدخل: \${m.actual}</p>\`).join('');
            document.getElementById('mismatchDetails').innerHTML = \`<div class="alert alert-warning"><i class="fas fa-info-circle"></i> البيانات المدخلة تختلف عن المقترحة:</div>\${details}\`;
            document.getElementById('mismatchModal').classList.add('show');
        }

        function closeMismatchModal() {
            document.getElementById('mismatchModal').classList.remove('show');
            document.getElementById('mismatchReason').value = '';
            pendingServiceData = null;
        }

        async function submitWithReason() {
            const reason = document.getElementById('mismatchReason').value.trim();
            if (!reason) { showToast('يرجى إدخال سبب الاختلاف', 'warning'); return; }

            const result = await aiSupervisor.processService(pendingServiceData, reason);
            closeMismatchModal();
            handleServiceResult(result, pendingServiceData);
        }

        document.querySelector('.modal-overlay .close-btn').addEventListener('click', closeMismatchModal);
        document.querySelectorAll('.modal-footer .btn-outline').forEach(btn => btn.addEventListener('click', closeMismatchModal));
        document.querySelectorAll('.modal-footer .btn-success').forEach(btn => btn.addEventListener('click', submitWithReason));
      `}</Script>
    </>
  )
}
